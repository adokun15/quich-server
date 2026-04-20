import express from "express";
import bodyParser from "body-parser";
import {
  whatsapp_verify_controller,
  whatsapp_webhook_controller,
} from "../controllers/whatsapp.js";
import { paystack_controller } from "../controllers/paystack.js";
import { paystack_vs } from "../utils/middleware/verifyPaystackRequest.js";

const webhook = express.Router();
/*
const processWebhook = async (req, handler) => {
  // Extract the unique ID, using Shopify for this example
  const unique_id = req.headers["X-Shopify-Webhook-Id"];
  // Create a new entry for that webhook id
  await client
    .query("INSERT INTO processed_webhooks (id) VALUES $1", [unique_id])
    .catch((e) => {
      // PostgreSQL code for unique violation
      if (e.code == "23505") {
        // We are already processing or processed this webhook, return silently
        return true;
      }
      throw e;
    });
  try {
    // Call you method
    await handler(req.body);
    return true;
  } catch {
    // Delete the entry on error to make sure the next one isn't ignored
    await client.query("DELETE FROM processed_webhooks WHERE id = $1", [
      unique_id,
    ]);
  }
};
*/
//app.post("/webhooks/order-created", (req, res) => {
// Wrap your doSomething method to handle your webhook
// return processWebhook(req, doSomething).catch(() => res.sendStatus(500));
//});

// store the raw request body to use it for signature verification

//Whatsapp webhook; aDD A
webhook
  .route("/whatsapp")
  .get(whatsapp_verify_controller)
  .post(
    express.json({
      verify: (req, res, buf) => {
        req.rawBody = buf;
      },
    }),
    whatsapp_webhook_controller,
  );

//Paystack Subscription only
webhook.post(
  "/paystack",
  bodyParser.raw({ type: "application/json" }),
  paystack_vs,
  paystack_controller,
);

//Supabase Trigger action

export default webhook;
