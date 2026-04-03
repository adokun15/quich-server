import express from "express";
import AsyncError from "../error/AsyncError.js";
import {
  create_update_at_trigger,
  create_merchant_table,
  create_store_table,
  create_categories_table,
  create_products_table,
  create_customers_table,
  create_customer_store_table,
  create_orders_table,
  create_login_tokens_table,
  create_otp_code_table,
  create_subscription_table,
  create_subscription_invoice_table,
  create_subscription_payment_table,
  create_whatsapp_state_table,
} from "./models.js";

const dbRoute = express.Router();

dbRoute.route("/").post(
  AsyncError(async (req, res) => {
    // await create_orders_table(); //Next Is Store But the enum is not complete yet
    res.json({ message: "done?" });
  }),
);

export default dbRoute;
