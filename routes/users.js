import express, { response } from "express";
import { getAuth } from "firebase-admin/auth";
import { getBanks, VerifyBankAccount } from "../db/paystack/bankVerify.js";
import { addAccountUserDb } from "../db/firebase/account.js";
import {
  createUserDb,
  GenerateStoreLink,
  getUserDb,
  saveStoreLink,
} from "../db/firebase/users.js";
const userRoute = express.Router();

//Provide-Uid-Middleware
userRoute.use(async (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  const decodedToken = await getAuth().verifyIdToken(token); //uid, email
  req.uid = decodedToken.uid;
  next();
});

userRoute
  .route("/bank")
  .get(async (req, res) => {
    //list of bank;
    const banks = await getBanks();

    res.json({ banks });
  })
  .post(async (req, res) => {
    //Verify accountnumber & bankcode
    const { number, code } = req.body;

    const getBankUser = await VerifyBankAccount({ number, code });
    //Return {accountName, number}
    res.json({ getBankUser });
  });

userRoute.route("/account").post(async (req, res) => {
  //user account
  if (!req?.uid) {
    res.status(404).send("User Id not found!");
  }

  const addToBank = await addAccountUserDb(req?.uid, req.body);

  res.json({ message: addToBank });
});
userRoute
  .route("/link")
  .get(async (req, res) => {
    const generatedLink = GenerateStoreLink();
    res.json({ link: generatedLink });
  })
  .post(async (req, res) => {
    //create link
    const { link } = req.body;

    if (!req?.uid) {
      res.status(404).json({ message: "User Id not found!" });
    }

    if (!link) {
      res.status(400).json({ message: "Invalid StoreLink" });
    }

    await saveStoreLink(req?.uid, link);

    res.json({ message: "store link has been saved" });
  });

userRoute
  .route("/")
  .post(async (req, res) => {
    //Create Db
    if (!req?.uid) {
      res.status(404).send("User Id not found!");
    }

    const mes = await createUserDb(req?.uid, req.body);
    res.json(mes);
  })
  .get(async (req, res) => {
    //Get User
    const user = await getUserDb(req.uid);
    res.json(user);
  })
  .delete((req, res) => {
    //delete User
  })
  .put((req, res) => {
    //Update Certain Field
  });
export default userRoute;
