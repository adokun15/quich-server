//import { GenerateSubscription } from "../services/subscription.js";
import { verifyPaystackSignature } from "../utils/middleware/verifyPaystackRequest.js";

//Process paystack
const secret = `${process.env.PAYSTACK_SECRET_KEY}`;

export const paystack_controller = async (req, res, next) => {
  //1.Send Back a Response : Acknowledge request!
  res.status(200).json({ message: "Webhook_Received" });

  //2. Verify Request
  const signature = req.headers["x-paystack-signature"];

  const raw = req.body;

  const isValid = verifyPaystackSignature(raw, signature, secret);

  if (!isValid) {
    return res.status(401).send("Invalid Signature");
  }

  // now safe to parse
  const body = JSON.parse(raw.toString("utf8"));

  //Use Ip addres
  const { event, data } = body;

  console.log(data);

  if (event === "subcription.create") {
    try {
      //Queued to a cron-job: Create Subcription
      //  await GenerateSubscription(data);
    } catch (e) {
      //Discord Log

      next(e);
    }
  }

  if (event === "subcription.disable") {
    try {
      /*
      Update Subcription status : inactive,
      Update Subcription end_date,
      */
    } catch (e) {
      next(e);
    }
  }

  if (event === "subcription.non_renew") {
    try {
      /*
      Update Subcription status : non_renew,
      */
    } catch (e) {
      next(e);
    }
  }

  if (event === "invoice.create") {
    try {
      /*
       create invoice,; status pending
       notify user;
      */
    } catch (e) {
      next(e);
    }
  }

  if (event === "invoice.payment_failed") {
    try {
      /*
       update invoice,; status failed
       update subscription status to 'attention'
       notify user: 'payment failed, we added grace period of 3 days to resume your subscrip';
       "Add extra 3day- grace-- EXTENDED END-DATE; on Subscription Table!"
      */
    } catch (e) {
      next(e);
    }

    if (event === "charge.success") {
      try {
        /*
       update invoice if invoice_parameter is there; status "paid", paid_at : "121"
       insert/create payment; status "paid", paid_at : "121"
       notify user;
      */
      } catch (e) {
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
  }

  //return res.status(200).end();
};
