import { verifyPaystackSignature } from "../utils/middleware/verifyPaystackRequest.js";
import {
  CancelSubscription,
  ConfirmSubscriptionPayment,
  GenerateSubscription,
  UpdateSubscription,
} from "../services/subscription.js";
import { DiscordPaystackLogger } from "../utils/middleware/logger.js";

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
      /*
      Update Subcription status : inactive,
      Update Subcription end_date,
      */
      await CancelSubscription(data);
    } catch (e) {
      next(e);
    }
  }

  /*
  if (event === "subscription.non_renew") {
    try {
      await SubscriptionNonRenewing(data);
      
      Update Subcription status : non_renew,
      
    } catch (e) {
      next(e);
    }
  }
  */

  if (event === "invoice.create") {
    try {
      //Log to discord to see how it is first!
      await DiscordPaystackLogger({
        merchant_id: data?.customer?.email || "No Available",
        action_type: "subscription_invoice_initiated",
        note: JSON.stringify(data),
      });
      /*
      await GenerateBillingInvoice(data);
      create invoice with status pending
      notify user;
      */
    } catch (e) {
      next(e);
    }
  }

  if (event === "invoice.payment_failed") {
    try {
      //Log to Discord to see how it is first;
      await DiscordPaystackLogger({
        merchant_id: data?.customer?.email || "No Available",
        action_type: "subscription_payment_failed",
        note: JSON.stringify(data),
      });

      //update invoice; status failed
      //notify user: "payment failed, we added grace period of 3 days to resume your subscrip";
      /*  await MarkBillingInvoiceStatus({
        invoice_info: {
          status: "failed",
          paid_at: null,
        },
      });
*/
      //update subscription status to "attention"
      // "Add extra 3day- grace-- EXTENDED END-DATE; on Subscription Table!"
      await UpdateSubscription({
        code: data?.subscription?.subscription_code,
        details: {
          status: "failed",
          //grace_day: "3days",
        },
      });
    } catch (e) {
      next(e);
    }
  }

  if (event === "charge.success") {
    try {
      await ConfirmSubscriptionPayment(data);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  if (event === "subscription.expiring_cards") {
    try {
      await DiscordPaystackLogger({
        merchant_id: data?.customer?.email || "No Available",
        action_type: "subscription_expiring_cards",
        note: JSON.stringify(data),
      });
      /*
      await sendExpiringCardNotice();
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
