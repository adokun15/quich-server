import express from "express";
import { getAuth } from "firebase-admin/auth";

import { getAllCustomers } from "../db/firebase/customers.js";
const customerRoute = express.Router();

//Provide-Uid-Middleware
customerRoute.use(async (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  const decodedToken = await getAuth().verifyIdToken(token); //uid, email
  req.uid = decodedToken.uid;
  next();
});

customerRoute.route("/").get(async (req, res, next) => {
  const merchantId = req.uid;

  try {
    const customers = await getAllCustomers(merchantId);

    res.json(customers);
  } catch (err) {
    console.log(err);
    next(err);
  }
});
export default customerRoute;
