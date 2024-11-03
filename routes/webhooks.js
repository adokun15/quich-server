import express from "express";
import crypto from "crypto";
import { createNewOrder, SuccessOrder } from "../db/firebase/orders.js";
import { addCustomerTransactions } from "../db/firebase/customers.js";
const webhook = express.Router();

const secret = process.env.WEBHOOK_SECRET_KEY;

webhook.post("/paystack", async (req, res) => {
  //Update order: paymentrequest.success
  //try {
  /*const verifyheader = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");
*/
  //  if (verifyheader === req.header["x-paystack-signature"]) {
  const { event, data } = req.body;
  res.status(200).end();

  console.log(event);
  console.log(data);

  if (event === "paymentrequest.pending") {
    //Create new Order
    try {
      await createNewOrder(data);
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
    } catch (e) {
      res.sendStatus(500).json({ message: "Something went Wrong" });
    }
  }

  if (event === "charge.success") {
    //Create/update: Customer and transaction
    try {
      await addCustomerTransactions(data);
    } catch (e) {
      res.sendStatus(500).json({ message: "Something went Wrong" });
    }
  } else {
    res.sendStatus(400).json({ message: "Bad Request!" });
  }
  // }
  // } catch (e) {
  // res.sendStatus(500).json({ message: "Something went wrong!" });
  // }
});
export default webhook;
