import express from "express";
import crypto from "crypto";
import { createNewOrder, SuccessOrder } from "../db/firebase/orders.js";
import { addCustomerTransactions } from "../db/firebase/customers.js";
const webhook = express.Router();

const secret = process.env.WEBHOOK_SECRET_KEY;

webhook.post("/paystack", async (req, res) => {
  //Update order: paymentrequest.success
  const { event, data } = req.body;
  try {
    const verifyheader = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (verifyheader === req.header["x-paystack-signature"]) {
      if (event === "paymentrequest.pending") {
        //Create new Order
        try {
          res.sendStatus(200).json({ message: "Payment Request pending" });
          await createNewOrder(data);
        } catch (e) {
          res.sendStatus(500).json({ message: "Something went Wrong" });
        }
      }

      if (event === "paymentrequest.success") {
        //update order and product
        try {
          res.sendStatus(200).json({ message: "Payment Request success" });
          await SuccessOrder(
            data,
            `${data?.metadata?.store}&${data?.metadata?.cartId}`
          );
        } catch (e) {
          res.sendStatus(500).json({ message: "Something went Wrong" });
        }
      }

      if (event === "charge.success") {
        //Create/update: Customer and transaction
        try {
          res.sendStatus(200).json({ message: "Charge Success" });
          await addCustomerTransactions(data);
        } catch (e) {
          res.sendStatus(500).json({ message: "Something went Wrong" });
        }

        res.sendStatus(200).json({ message: "Webhook received" });
      } else {
        res.sendStatus(400).json({ message: "Bad Request!" });
      }
    }
  } catch (e) {
    res.sendStatus(500).json({ message: "Something went wrong!" });
  }
});
export default webhook;
