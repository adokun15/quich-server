import express from "express";
import { getBanks, VerifyBankAccount } from "../db/paystack/bankVerify.js";
import { addAccountUserDb } from "../db/firebase/account.js";
import {
  GenerateStoreLink,
  getUserDb,
  saveStoreLink,
} from "../db/firebase/users.js";
import { AuthorizationRouteMiddleware } from "../utils/Auth.js";
import AsyncError from "../utils/AsyncError.js";
import CustomError from "../utils/error.js";
const userRoute = express.Router();

//Provide-Uid-Middleware
userRoute.use(AuthorizationRouteMiddleware);

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
  .route("/link")
  .get(
    AsyncError(async (req, res) => {
      const generatedLink = GenerateStoreLink();
      res.json({ link: generatedLink });
    })
  )
  .post(
    AsyncError(async (req, res) => {
      //create link
      const { link } = req.body;

      if (!req?.uid) {
        throw new CustomError("User Id not found!");
      }

      if (!link) {
        throw new CustomError("Invalid StoreLink");
      }

      await saveStoreLink(req?.uid, link);

      res.json({ message: "Store link has been saved" });
    })
  );

userRoute
  .route("/")
  // .post(async (req, res) => {
  //   //Create Db
  //  if (!req?.uid) {
  //  res.status(404).send("User Id not found!");
  //}

  // const mes = await createUserDb(req?.uid, req.body);
  //res.json(mes);
  //})
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
  })
  .put((req, res) => {
    //Update Certain Field: PRO
  });
export default userRoute;
