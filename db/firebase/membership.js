import { getFirestore } from "firebase-admin/firestore";
import { NewPaymentPlan, UpgradedPaymentPlan } from "../whatapp/payment.js";
import { getAuth } from "firebase-admin/auth";

export const addUserPaymentInfo = async (data) => {
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
            name: "Test Name",
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
            name: "Test Name",
          });
        }
        return "User plan updated!";
      }
    );

    return updateUserPlan;
  } catch (e) {
    throw new CustomError(e?.message || e?.code || " Something went wrong!");
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
