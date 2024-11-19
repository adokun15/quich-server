import express from "express";
import crypto from "crypto";
import { createNewOrder, SuccessOrder } from "../db/firebase/orders.js";
import { addCustomerTransactions } from "../db/firebase/customers.js";
import { whatsappMessage } from "../utils/whatsapp.js";
const webhook = express.Router();

const secret = process.env.WEBHOOK_SECRET_KEY;

webhook.post("/paystack", async (req, res) => {
  const verifyheader = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (verifyheader !== req.header["x-paystack-signature"]) {
    res.status(400).end();
    return;
  }
  const { event, data } = req.body;

  if (event === "paymentrequest.pending") {
    //Create new Order
    try {
      await createNewOrder(data);
      res.status(200).end();
      return;
    } catch (e) {
      res.sendStatus(500).json({ message: "Something went Wrong" });
    }
  }

  if (event === "paymentrequest.success") {
    //update order and product
    try {
      await SuccessOrder(
        data,
        `${data?.metadata?.store}&${data?.metadata?.cartId}`
      );
      res.status(200).end();
    } catch (e) {
      res.sendStatus(500).json({ message: "Something went Wrong" });
    }
  }

  if (event === "charge.success") {
    //Create/update: Customer and transaction
    try {
      console.log(data);
      await addCustomerTransactions(data);
      res.status(200).end();
    } catch (e) {
      res.sendStatus(500).json({ message: "Something went Wrong" });
    }
  }
  res.status(200).end();
});
export default webhook;
