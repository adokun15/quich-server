//Fetch subscription

import { getMerchantFromDb } from "../repository/merchants.js";
import { GetMerchantStoreDetail } from "../repository/stores.js";
import {
  CreateInvoice,
  CreatePaymentforMerchant,
  CreateSubscriptionforMerchant,
  GetInvoicesDetailForMerchant,
  GetPaymentsListForMerchant,
  GetSingleInvoiceDetailForMerchant,
  GetSubscriptionDetailForMerchant,
  UpdateInvoiceforMerchant,
  UpdateSubscriptionforMerchant,
} from "../repository/subscription.js";
import DatabaseError from "../utils/error/DatabaseError.js";
import CustomError from "../utils/error/error.js";
import ValidationError from "../utils/error/ValidationError.js";
import { paystack, paystack_ } from "../utils/paystack/paystack.js";
import {
  disableSubscriptionFromPaystack,
  FetchSubscriptionFromPaystack,
} from "../utils/paystack/Subscription.js";
import {
  sendBillingInvoiceNotice,
  sendBillingInvoiceStatus,
} from "../utils/whatsapp/outgoing/message/templates/billing_invoice.js";

//---------------------- USER ACTION(START) --------------------

//Send new payment link to user!
export const InitializeSubscription = async ({
  merchant_id,
  plan_code,
  amount,
}) => {
  try {
    //Get Email
    const { email, phone } = await getMerchantFromDb(merchant_id);

    if (!email) {
      throw new ValidationError("Email is Required!");
    }

    const config = {
      method: "POST",
      endpoint: "/transaction/initialize",
    };

    const data = {
      email,
      amount,
      plan: plan_code,
      metadata: {
        merchant_id,
        phone,
      },
    };

    const url = await paystack(config, data).then((data) => {
      return data?.data?.authorization_url;
    });

    return url;
  } catch (e) {
    console.log(e);
    if (e?.message === "fetch failed") {
      throw new CustomError("No internet connection!");
    }
    throw new CustomError(e?.message);
  }
};

/*
export const DisableSubscriptionAction = async ({ merchant_id }) => {
  try {
    //Get Email Token
    const { email_token, subscription_code } =
      await GetSubscriptionDetailForMerchant({
        merchant_id,
      });

    if (!email_token || !subscription_code) {
      throw new ValidationError(
        "Something went request. Subscription is not valid!",
      );
    }

    const config = {
      method: "POST",
      endpoint: "/subscription/disable",
    };

    const data = {
      token: email_token,
      code: subcription_code,
      metadata: {
        merchant_id,
        phone,
      },
    };

    const res = await paystack(config, data).then((data) => {
      return data?.data;
    });

    return res;
  } catch (e) {
    console.log(e);
    if (e?.message === "fetch failed") {
      throw new CustomError("No internet connection!");
    }
    throw new CustomError(e?.message);
  }
};
*/

export const ManageSubscriptionLink = async ({ merchant_id }) => {
  try {
    //Get Email Token
    const { subscription_code } = await GetSubscriptionDetailForMerchant({
      merchant_id,
    });

    if (!subscription_code) {
      throw new ValidationError(
        "Something went wrong. Subscription is not active!",
      );
    }

    //const subscription_code = "SUB_ekqi1w0cbv3hdtb";

    const config = {
      method: "GET",
      endpoint: `/subscription/${subscription_code}/manage/link`,
    };

    const url = await paystack_(config).then((data) => {
      return data?.data?.link;
    });

    return url;
  } catch (e) {
    console.log(e);
    if (e?.message === "fetch failed") {
      throw new CustomError("No internet connection!");
    }
    throw new CustomError(e?.message);
  }
};

//Get Subscription Details
export const getSubcriptionInfo = async ({
  merchant_id = "",
  subscription_id = "",
}) => {
  if (!merchant_id && !subscription_id) {
    throw new ValidationError("Invalid input data!", 400);
  }

  const subcription = await GetSubscriptionDetailForMerchant({
    merchant_id: merchant_id || subscription_id,
  });

  //later filter the 'latest active'
  return subcription;
};

//Fetch invoices
export const getInvoices = async ({ merchant_id, filters }) => {
  try {
    //Get subscription code;
    const subscription = await GetSubscriptionDetailForMerchant({
      merchant_id,
    });

    if (!subscription) return [];

    //Get the invoices list; Filters Later
    const invoices = await GetInvoicesDetailForMerchant({
      subcription_code: subscription?.subcription_code,
    });

    return invoices;
  } catch (e) {
    throw new CustomError(e);
  }
};

//Fetch 1 invoices
export const getSingleInvoice = async ({ invoice_code, merchant_id }) => {
  const subscription = await GetSubscriptionDetailForMerchant({
    merchant_id,
  });

  /*
  if (!subscription) {
    throw new CustomError("Invoice not found!");
  }*/

  const data = await GetSingleInvoiceDetailForMerchant({
    subscription_code: subscription?.subcription_code,
    invoice_code,
  });
  return data;
};

//Fetch all payments
export const getAllUserPayments = async ({ merchant_id }) => {
  const data = await GetPaymentsListForMerchant({ merchant_id });

  return data;
};

//---------------------- USER ACTION (ENDS) --------------------

//----------------------WEBHOOK ACTION (START) --------------------
//Webhook: Generate new invoice ahead
export const GenerateBillingInvoice = async ({
  invoice_info,
  merchant_phone,
}) => {
  try {
    //Extract Info
    const data = await CreateInvoice(invoice_info);

    //Send Remainder to User Whatsapp;
    await sendBillingInvoiceNotice(merchant_phone, data);
  } catch (e) {
    throw new CustomError(e);
  }
};

//Webhook: Create Subscription
export const GenerateSubscription = async ({ merchant_id, sub_code }) => {
  try {
    const { subcription } = await getSubcriptionInfo(merchant_id);

    const deactivatesubs = async (sub) => {
      //Update is_current to false
      await UpdateSubscription({
        details: { is_current: false },
        code: sub?.subscription_code,
      });

      //Manually disable all other subscriptions;
      await disableSubscriptionFromPaystack({
        sub_code: sub?.subscription_code,
        email_token: sub?.email_token,
      });
    };

    if (subcription?.length > 0) {
      subcription.forEach(deactivatesubs);
    }

    //Create new subscription and set is_current to true
    await CreateSubscriptionforMerchant(data);
  } catch (e) {
    throw new CustomError(e);
  }
};

//Webhook: Manage billing invoice status
export const MarkBillingInvoiceStatus = async ({
  invoice_id,
  invoice_info,
}) => {
  try {
    const data = await UpdateInvoiceforMerchant(
      {
        status: invoice_info?.status,
        paid_at: invoice_info?.paid_at || null,
      },
      invoice_id,
    );

    //Send Remainder to User Whatsapp;
    await sendBillingInvoiceStatus(merchant_phone, data);
  } catch (e) {
    throw new CustomError(e);
  }
};

//Manage User Subscription; id or code
export const UpdateSubscription = async ({ details, code }) => {
  try {
    const data = await UpdateSubscriptionforMerchant(details, code);
    return data;
  } catch (e) {
    throw new CustomError(e);
  }
};

//Disable User Subcription;
export const CancelSubscription = async (merchant_id) => {
  try {
    const subscription = await getSubcriptionInfo(merchant_id);

    if (subscription.error) {
      throw DatabaseError(subscription.error?.message);
    }

    const data = await disableSubscriptionFromPaystack({
      sub_code: subscription?.subscription_code,
      email_token: subscription?.email_token,
    });
    return data;
  } catch (e) {
    throw new CustomError(e);
  }
};

//Create New Payment data only when money is available
export const ConfirmSubscriptionPayment = async ({ payment_details }) => {
  try {
    await CreatePaymentforMerchant(payment_details);
  } catch (e) {
    throw new CustomError(e);
  }
};

//SUCCESSFUL DEBITED PAYMENT
export const addUserPaymentInfo = async (data) => {
  const merchant_id = data?.metadata?.userId;
  const plan = data?.metadata?.plan;
  const plan_code = data?.plan; //maybe

  try {
    //FETCH USER WITH ID;
    const merchant = await getMerchantFromDb(merchant_id);

    //cHECK IF THEY EXIST;
    if (!merchant) {
      //Log to discord
      //Throw error 401;
    }

    //uPDATE DB: PAYMENT;
    await CreatePaymentforMerchant(data);

    //Await Subscription;
    await UpdateSubscriptionforMerchant(
      {
        code: data?.customer?.customer_code,
        paymentDate: data?.paid_at,
        authCode: data?.authorization.authorization_code,
        amount: data.amount / 100 + amt,
        plan: data?.metadata.plan,
      },
      null,
    );

    //sEND A WHATSAPP  TEMPLATE
    /*
              if (!data?.metadata?.phone) return;
              await NewPaymentPlan(data?.metadata?.phone, {
                          amt: (data.amount / 100).toLocaleString(),
                          plan: `${data?.metadata.plan} plan`.toUpperCase(),
                          name: data?.metadata.username || "No name",
                        });
              await UpgradedPaymentPlan(data?.metadata?.phone, {
                amt: (data.amount / 100 + amt).toLocaleString(),
                plan: `${data?.metadata.plan} plan`.toUpperCase(),
                name: data?.metadata.username || "No name",
              });
              */
  } catch (e) {
    throw new CustomError(e?.message || e?.code || " Something went wrong!");
  }
};

//----------------------WEBHOOK ACTION (END ) --------------------

//------ CRON JOB: EVERY MIDNIGHT; - Batch sync subscriptions(days) with paystack; ---------------
export const SyncSubscriptions = async (sub_code) => {
  try {
    const paystackSub = await FetchSubscriptionFromPaystack({
      sub_code: sub.subscription_code,
    });

    if (!paystackSub) return;

    await UpdateSubscription({
      details: {
        status: paystackSub?.status,
        next_payment_date: paystackSub?.next_payment_date,
      },
      code: sub_code,
    });
  } catch (e) {
    throw new CustomError(e);
  }
};

/**
 * {
   id: 4392285305,
   domain: 'test',
   status: 'success',
   reference: '5wguu10b2z',
   amount: 930000,
   message: null,
   gateway_response: 'Successful',
   paid_at: '2024-11-19T14:26:52.000Z',
  created_at: '2024-11-19T14:26:22.000Z',
  channel: 'card',
  currency: 'NGN',
  ip_address: '197.211.61.46',
  metadata: {
    plan: 'standard',
    phone: '8129584035',
    upgrade: 'false',
    user: 'merchant',
    userId: 'KZfR088rlMc67THuyGUzfoDOH5D2',
    cancel_action: ''
    username:""
  },
  fees_breakdown: null,
  log: null,
  fees: 23950,
  fees_split: null,
  authorization: {
    authorization_code: 'AUTH_o77ro809v1',
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
    signature: 'SIG_Q6ArP74UvElPukPmwLXN',
    account_name: null,
    receiver_bank_account_number: null,
    receiver_bank: null
  },
  customer: {
    id: 203318447,
    first_name: 'soma',
    last_name: null,
    email: 'contact.danielamos@gmail.com',
    customer_code: 'CUS_0tdf3e9j99hhe50',
    phone: '07057413268',
    metadata: {},
    risk_action: 'default',
    international_format_phone: null
  },
  plan: {},
  subaccount: {},
  split: {},
  order_id: null,
  paidAt: '2024-11-19T14:26:52.000Z',
  requested_amount: 930000,
  pos_transaction_data: null,
  source: {
    type: 'api',
    source: 'merchant_api',
    entry_point: 'transaction_initialize',
    identifier: null
  }
}
 */
