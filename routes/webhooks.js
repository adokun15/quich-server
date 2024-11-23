import express from "express";
import crypto from "crypto";
import { createNewOrder, SuccessOrder } from "../db/firebase/orders.js";
import { addCustomerTransactions } from "../db/firebase/customers.js";
import { addUserPaymentInfo } from "../db/firebase/membership.js";
const webhook = express.Router();

const secret = `${process.env.WEBHOOK_SECRET_KEY}`;

webhook.post("/paystack", async (req, res, next) => {
  // const hash = crypto
  // .createHmac("sha512", secret)
  //  .update(req.body.toString())
  //  .digest("hex");

  //if (hash == req.headers["x-paystack-signature"]) {
  const { event, data } = req.body;

  if (event === "paymentrequest.pending") {
    //Create new Order
    try {
      await createNewOrder(data);
      return res.status(200).json({ message: "success" });
    } catch (e) {
      next(e);
    }
  }

  if (event === "paymentrequest.success") {
    //update order and product
    try {
      await SuccessOrder(
        data,
        `${data?.metadata?.store}&${data?.metadata?.cartId}`
      );
      return res.status(200).json({ message: "success" });
    } catch (e) {
      next(e);
    }
  }

  if (event === "charge.success" && !data?.metadata?.user) {
    //Create/update: Customer and transaction
    try {
      await addCustomerTransactions(data);
      return res.status(200).json({ message: "success" });
    } catch (e) {
      next(e);
    }
  }

  if (event === "charge.success" && data?.metadata?.user === "merchant") {
    //One time payment Service
    try {
      await addUserPaymentInfo(data);
      return res.status(200).json({ message: "success" });
    } catch (e) {
      next(e);
    }
  }
  return res.status(200).end();
});
export default webhook;
