//import { GenerateSubscription } from "../services/subscription.js";
import { console } from "inspector/promises";
import { verifyPaystackSignature } from "../utils/middleware/verifyPaystackRequest.js";
import {
  addUserPaymentInfo,
  CancelSubscription,
  GenerateBillingInvoice,
  GenerateSubscription,
  SendSubscriptionNonRenewing,
} from "../services/subscription.js";

//Process paystack
export const paystack_controller = async (req, res, next) => {
  //1.Send Back a Response : Acknowledge request!

  //2. Verify Request
  // const signature = req.headers["x-paystack-signature"];

  const raw = req.body;
  /*
  const isValid = verifyPaystackSignature(
    raw,
    signature,
    process.env.PAYSTACK_SECRET_KEY,
  );

  //console.log(isValid);
  /*if (!isValid) {
    return res.status(401).send("Invalid Signature");
    }
    */
  // now safe to parse
  const body = JSON.parse(raw.toString("utf8"));
  //  console.log(signature);

  //Use Ip addres
  const { event, data } = body;

  if (event === "subscription.create") {
    try {
      const {
        status: subscription_status,
        subscription_code,
        email_token,
        amount,
        next_payment_date,
        invoice_limit,
        plan: { plan_code, name: plan_name, interval, currency },
        customer: { email, customer_code },
      } = data;

      await GenerateSubscription({
        next_payment_date,
        subscription_code,
        subscription_status,
        email_token,
        invoice_limit,
        plan_code,
        plan_name,
        interval,
        currency,
        email,
        customer_code,
        amount,
      });
    } catch (e) {
      //Discord Log

      next(e);
    }
  }

  if (event === "subscription.disable") {
    try {
      await CancelSubscription(data);
      /*
      Update Subcription status : inactive,
      Update Subcription end_date,
      */
    } catch (e) {
      next(e);
    }
  }

  if (event === "subscription.non_renew") {
    try {
      await SendSubscriptionNonRenewing(data);
      /*
      Update Subcription status : non_renew,
      */
    } catch (e) {
      next(e);
    }
  }

  if (event === "invoice.create") {
    try {
      const {} = data;

      await GenerateBillingInvoice({
        merchant_phone: 120313,
        invoice_info: "asdad",
      });

      /*
      create invoice with status pending
      notify user;
      */
    } catch (e) {
      next(e);
    }
  }

  if (event === "invoice.payment_failed") {
    try {
      /*
      update invoice; status failed
      update subscription status to "attention"
      notify user: "payment failed, we added grace period of 3 days to resume your subscrip";
      "Add extra 3day- grace-- EXTENDED END-DATE; on Subscription Table!"
      */
    } catch (e) {
      next(e);
    }
  }

  if (event === "charge.success") {
    try {
      await addUserPaymentInfo(data);
      /*
        GET https://api.paystack.co/transaction/verify/:reference to get full details
        update invoice if invoice_parameter is there; status "paid", paid_at : "121"
        insert/create payment; status "paid", paid_at : "121"
        notify user;
      */
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //
  if (event === "subscription.expiring_cards") {
    try {
      /*
        notify user via Email!;
        send a link to reset!
      */
    } catch (e) {
      next(e);
    }
  }

  //return res.status(200).end();
  res.status(200).json({ message: "Webhook_dasheddd" });
};
