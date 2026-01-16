//Pay for Order;
import express from "express";
import bodyParser from "body-parser";
//import crypto from "crypto";
import { createNewOrder, SuccessOrder } from "../db/firebase/orders.js";
import { addCustomerTransactions } from "../db/firebase/customers.js";
import { addUserPaymentInfo } from "../db/firebase/membership.js";
const webhook = express.Router();
const secret = `${process.env.PAYSTACK_SECRET_KEY}`;

//Whatsapp verification webhook;
app.get("/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFICATION_TOKEN
  ) {
    console.log("Whatsapp Webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

webhook.post(
  "/paystack",
  bodyParser.raw({ type: "application/json" }),
  async (req, res, next) => {
    //Use Ip addres

    /*  const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");
   */
    //    if (hash == req.headers["x-paystack-signature"]) {

    const { event, data } = req.body;

    //    console.log(req.ip);

    //  console.log(event, data);
    if (event === "paymentrequest.pending") {
      //Create new Order
      try {
        await createNewOrder(data);
        return res.status(200).json({ message: "success" });
      } catch (e) {
        console.log(e);
        next(e);
      }
    }

    if (event === "paymentrequest.success") {
      //update order and product
      try {
        await SuccessOrder(
          data,
          `${data?.metadata?.store}&${data?.metadata?.cartId}`,
        );
        return res.status(200).json({ message: "success" });
      } catch (e) {
        console.log(e);
        next(e);
      }
    }

    if (event === "charge.success" && !data?.metadata?.user) {
      //Create/update: Customer and transaction
      try {
        await addCustomerTransactions(data);
        return res.status(200).json({ message: "success" });
      } catch (e) {
        console.log(e);
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
    //}
    return res.status(200).end();
  },
);
export default webhook;
