import express from "express";
import { getBanks, VerifyBankAccount } from "../db/paystack/bankVerify.js";
import { addAccountUserDb } from "../db/firebase/account.js";
import { getUserDb } from "../db/firebase/users.js";
import { AuthorizationRouteMiddleware } from "../utils/Auth.js";
import AsyncError from "../utils/AsyncError.js";
import CustomError from "../utils/error.js";
import {
  paymentforBasic,
  paymentforPremium,
  paymentforStandard,
  upgradeFromBasicToPremium,
  upgradeFromStandardToPremium,
  upgradeToStandard,
} from "../db/paystack/oneTimePayment.js";
const userRoute = express.Router();

//Provide-Uid-Middleware
userRoute.use(AuthorizationRouteMiddleware);

userRoute.route("/payment/:type").post(
  AsyncError(async (req, res, next) => {
    const type = req.params.type;

    const uid = req.uid;
    const { email, phone, name } = req.body;

    let plan = null;
    let upgrade = null;

    if (type === "basic") {
      plan = await paymentforBasic(email, uid, phone, name);
      res.json({ url: plan });
    }

    if (type === "standard") {
      plan = await paymentforStandard(email, uid, phone, name);
      res.json({ url: plan });
    }

    if (type === "premium") {
      plan = await paymentforPremium(email, uid, phone, name);
      res.json({ url: plan });
    }

    if (type === "basic_standard") {
      upgrade = await upgradeToStandard(email, uid, phone, name);
      res.json({ url: upgrade });
    }

    if (type === "basic_premium") {
      upgrade = await upgradeFromBasicToPremium(email, uid, phone, name);
      res.json({ url: upgrade });
    }

    if (type === "standard_premium") {
      upgrade = await upgradeFromStandardToPremium(email, uid, phone, name);
      res.json({ url: upgrade });
    }

    next();
    //res.status(400).json({ message: "Bad request!" });
  })
);

//list of Bank
userRoute
  .route("/bank")
  .get(
    AsyncError(async (req, res) => {
      const banks = await getBanks();
      res.json({ banks });
    })
  )
  .post(
    AsyncError(async (req, res) => {
      //Verify accountnumber & bankcode
      const { number, code } = req.body;
      const getBankUser = await VerifyBankAccount({ number, code });
      //Return {accountName, number}
      res.json({ getBankUser });
    })
  );

//Recipient Code Account
userRoute.route("/account").post(
  AsyncError(async (req, res) => {
    //user account
    if (!req?.uid) {
      throw new CustomError("User Id not found!");
    }

    const addToBank = await addAccountUserDb(req?.uid, req.body);

    res.json({ message: addToBank });
  })
);

userRoute
  .route("/")
  .get(
    AsyncError(async (req, res) => {
      //Get User
      if (!req?.uid) {
        throw new CustomError("User Id not found!");
      }

      const user = await getUserDb(req.uid);
      res.json(user);
    })
  )
  .delete((req, res) => {
    //delete User
  });
export default userRoute;
