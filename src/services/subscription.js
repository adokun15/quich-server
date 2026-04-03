//Fetch subscription

import {
  CreateInvoice,
  CreatePaymentforMerchant,
  CreateSubscriptionforMerchant,
  GetInvoicesDetailForMerchant,
  GetSingleInvoiceDetailForMerchant,
  GetSubscriptionDetailForMerchant,
  UpdateInvoiceforMerchant,
  UpdateSubscriptionforMerchant,
} from "../repository/subscription.js";
import CustomError from "../utils/error/error.js";
import {
  disableSubscriptionFromPaystack,
  FetchSubscriptionFromPaystack,
} from "../utils/paystack/Subscription.js";
import {
  sendBillingInvoiceNotice,
  sendBillingInvoiceStatus,
} from "../utils/whatsapp/outgoing/message/templates/billing_invoice.js";

export const getSubcriptionInfo = async ({
  merchant_id = "",
  subcription_id = "",
}) => {
  try {
    const subcription = await GetSubscriptionDetailForMerchant(
      merchant_id || subcription_id,
    );

    //later filter the 'latest active'
    return subcription[0];
  } catch (e) {
    throw CustomError(e);
  }
};

//Fetch invoices
export const getInvoices = async ({ subcription_code = "" }) => {
  try {
    const invoices = await GetInvoicesDetailForMerchant(subcription_code, {});

    if (invoices?.length !== 0) {
      throw CustomError("No Invoices!");
    }

    return invoices;
  } catch (e) {
    throw CustomError(e);
  }
};

//Fetch 1 invoices
export const getSingleInvoice = async ({
  subcription_code = "",
  invoice_code,
}) => {
  try {
    const data = await GetSingleInvoiceDetailForMerchant({
      subscription_code,
      invoice_code,
    });
    if (!data) {
      throw new CustomError(e);
    }
    return data;
  } catch (e) {
    throw new CustomError(e);
  }
};

//Generate new invoice ahead
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

//Create Subscription
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

//Manage billing invoice status
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

//Create New Payment data only when money is available
export const ConfirmSubscriptionPayment = async ({ payment_details }) => {
  try {
    await CreatePaymentforMerchant(payment_details);
  } catch (e) {
    throw new CustomError(e);
  }
};

//------ sync subscription with paystack --- Before Expensive actions do this! ------------
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

//------ CHECKS AND LIMITS FOR USAGE!------------

export const addUserPaymentInfo = async (data) => {
  /*
  const uid = data?.metadata?.userId;
  const plan = data?.metadata?.plan;

  const userRef = getFirestore().collection(`users/`).doc(`${uid}`);
  try {
    const updateUserPlan = await getFirestore().runTransaction(
      async (transaction) => {
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists) {
          throw new Error("User not Found!");
        }

        //update custom claim
        await getAuth().setCustomUserClaims(uid, {
          role: plan,
          expiresIn: null,
        });

        let amt = +userDoc.data()?.membership?.amount || 0;

        if (data?.metadata.upgrade) {
          //add plan to user DB --> plan
          transaction.update(userRef, {
            membership: {
              code: data?.customer?.customer_code,
              paymentDate: data?.paid_at,
              authCode: data?.authorization.authorization_code,
              amount: data.amount / 100 + amt,
              plan: data?.metadata.plan,
            },
          });

          if (!data?.metadata?.phone) return;
          //Notice on whatsapp(later)
          await UpgradedPaymentPlan(data?.metadata?.phone, {
            amt: (data.amount / 100 + amt).toLocaleString(),
            plan: `${data?.metadata.plan} plan`.toUpperCase(),
            name: data?.metadata.username || "No name",
          });
        }

        //New Payment
        if (!data?.metadata.upgrade) {
          transaction.update(userRef, {
            membership: {
              code: data?.customer?.customer_code,
              paymentDate: data?.paid_at,
              authCode: data?.authorization.authorization_code,
              amount: data.amount / 100,
              plan: data?.metadata.plan,
            },
          });

          if (!data?.metadata?.phone) return;

          await NewPaymentPlan(data?.metadata?.phone, {
            amt: (data.amount / 100).toLocaleString(),
            plan: `${data?.metadata.plan} plan`.toUpperCase(),
            name: data?.metadata.username || "No name",
          });
        }
        return "User plan updated!";
      },
    );

    return updateUserPlan;
  } catch (e) {
    throw new CustomError(e?.message || e?.code || " Something went wrong!");
  }
*/
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
