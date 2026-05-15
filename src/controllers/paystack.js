//import { GenerateSubscription } from "../services/subscription.js";
import { console } from "inspector/promises";
import { verifyPaystackSignature } from "../utils/middleware/verifyPaystackRequest.js";

//Process paystack
export const paystack_controller = async (req, res, next) => {
  //1.Send Back a Response : Acknowledge request!
  res.status(200).json({ message: "Webhook_Received" });

  //2. Verify Request
  const signature = req.headers["x-paystack-signature"];
  //const signature =
  // "7b579c11dc39d9395a73669c4fd51ccea9cfc64fc1aaabb0f05aa140b8d62be369852b8e0fdd17c04ba10cd1ea014e2d690cb026b9d97de47b3258401c14532d";

  const raw = req.body;
  /*
  const isValid = verifyPaystackSignature(
    raw,
    signature,
    process.env.PAYSTACK_SECRET_KEY,
  );
*/
  //console.log(isValid);
  /*if (!isValid) {
    return res.status(401).send("Invalid Signature");
  }
*
  /*

  1.
  //"7b579c11dc39d9395a73669c4fd51ccea9cfc64fc1aaabb0f05aa140b8d62be369852b8e0fdd17c04ba10cd1ea014e2d690cb026b9d97de47b3258401c14532d"
  {
    event: 'subscription.create',
    data: {
      id: 1167984,
      domain: 'test',
      status: 'non-renewing',
      subscription_code: 'SUB_6jw0c7vxie03rs4',
      email_token: '228ux5jt2ka1hce',
      amount: 100000,
      cron_expression: '20 19 14 * *',
    next_payment_date: '2026-06-14T19:20:00.000Z',
    open_invoice: null,
    createdAt: '2026-05-14T19:20:48.000Z',
    integration: 1731793,
    plan: {
      id: 3693949,
      name: 'Trial Plan - First month',
      plan_code: 'PLN_eyi0wu17c3xdyb3',
      description: 'Pay low price for your first month',
      amount: 100000,
      interval: 'monthly',
      send_invoices: 1,
      send_sms: 1,
      currency: 'NGN'
      },
      authorization: {
        authorization_code: 'AUTH_6ii3rxh133',
        bin: '408408',
        last4: '4081',
        exp_month: '12',
        exp_year: '2030',
        channel: 'card',
        card_type: 'visa ',
        bank: 'TEST BANK',
        country_code: 'NG',
        brand: 'visa',
        reusable: true,
        signature: 'SIG_EWAS0rsSPm5tc9ZtKWBd',
        account_name: null
        },
        customer: {
      id: 339948631,
      first_name: 'Amos',
      last_name: 'Daniel',
      email: 'amosdaniel2005@gmail.com',
      customer_code: 'CUS_4fii4l3suqpgyk0',
      phone: '',
      metadata: null,
      risk_action: 'default',
      international_format_phone: null
      },
      invoice_limit: 1,
      split_code: null,
      most_recent_invoice: null
      }
}


2..
"0f44d6475567f7e81600559b64a3dd57631c226ea059c5647902d5c978e1c62150194eae132dc2e379e2eb017e6c62ff1c37e4c05a24154ce8ffda626a3f373c"
{
  event: 'charge.success',
  data: {
    id: 6146696945,
    domain: 'test',
    status: 'success',
    reference: 'i6q5eftiqs',
    amount: 100000,
    message: null,
    gateway_response: 'Successful',
    paid_at: '2026-05-14T19:20:48.000Z',
    created_at: '2026-05-14T19:20:18.000Z',
    channel: 'card',
    currency: 'NGN',
    ip_address: '129.222.206.65',
    metadata: {
      merchant_id: '6b62a0ec-70b3-4c11-b537-c873caa8adce',
      phone: '8129584035'
    },
    fees_breakdown: null,
    log: null,
    fees: 1500,
    fees_split: null,
    authorization: {
      authorization_code: 'AUTH_6ii3rxh133',
      bin: '408408',
      last4: '4081',
      exp_month: '12',
      exp_year: '2030',
      channel: 'card',
      card_type: 'visa ',
      bank: 'TEST BANK',
      country_code: 'NG',
      brand: 'visa',
      reusable: true,
      signature: 'SIG_EWAS0rsSPm5tc9ZtKWBd',
      account_name: null,
      receiver_bank_account_number: null,
      receiver_bank: null
    },
    customer: {
      id: 339948631,
      first_name: 'Amos',
      last_name: 'Daniel',
      email: 'amosdaniel2005@gmail.com',
      customer_code: 'CUS_4fii4l3suqpgyk0',
      phone: '',
      metadata: null,
      risk_action: 'default',
      international_format_phone: null
      },
      plan: {
      id: 3693949,
      name: 'Trial Plan - First month',
      plan_code: 'PLN_eyi0wu17c3xdyb3',
      description: 'Pay low price for your first month',
      amount: 100000,
      interval: 'monthly',
      send_invoices: 1,
      send_sms: 1,
      currency: 'NGN'
    },
    subaccount: {},
    split: {},
    order_id: null,
    paidAt: '2026-05-14T19:20:48.000Z',
    requested_amount: 100000,
    pos_transaction_data: null,
    source: {
      type: 'api',
      source: 'merchant_api',
      entry_point: 'transaction_initialize',
      identifier: null
      }
  }
}

  */

  // now safe to parse
  const body = JSON.parse(raw.toString("utf8"));
  console.log(body);
  console.log(signature);

  //Use Ip addres
  const { event, data } = body;
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
        GET https://api.paystack.co/transaction/verify/:reference
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
