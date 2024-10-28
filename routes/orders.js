import express from "express";
import { getOrders } from "../db/firebase/orders.js";
import { getAuth } from "firebase-admin/auth";
const orderRoute = express.Router();

//Get Merchant Orders

orderRoute.use(async (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  const decodedToken = await getAuth().verifyIdToken(token); //uid, email
  req.uid = decodedToken.uid;
  next();
});

orderRoute.route("/").get(async (req, res, next) => {
  try {
    const merchantId = req.uid;
    const orders = await getOrders(merchantId);
    res.json(orders);
  } catch (e) {
    next(e);
  }
});

export default orderRoute;
