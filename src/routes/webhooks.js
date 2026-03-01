import express from "express";
import bodyParser from "body-parser";
import {
  whatsapp_verify_controller,
  whatsapp_webhook_controller,
} from "../controllers/whatsapp.js";
import { paystack_controller } from "../controllers/paystack.js";
import { paystack_vs } from "../utils/middleware/verifyPaystackRequest.js";

const webhook = express.Router();

//Whatsapp webhook; aDD A
webhook
  .route("/whatsapp")
  .get(whatsapp_verify_controller)
  .post(whatsapp_webhook_controller);

//Paystack Subscription only
webhook.post(
  "/paystack",
  bodyParser.raw({ type: "application/json" }),
  paystack_vs,
  paystack_controller,
);

//Supabase Trigger action

export default webhook;
