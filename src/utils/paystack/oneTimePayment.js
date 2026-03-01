import CustomError from "../error/error.js";
import { paystack } from "../paystack/paystack.js";

const transaction = {
  method: "POST",
  endpoint: "/transaction/initialize",
};

const callback_url = `${
  process.env.NODE_ENV === "development"
    ? process.env.MY_URL_CLIENT_SIDE_DEV
    : process.env.MY_URL_CLIENT_SIDE_LIVE
}/auth/login`;

const cancel_action = `${
  process.env.NODE_ENV === "development"
    ? process.env.MY_URL_CLIENT_SIDE_DEV
    : process.env.MY_URL_CLIENT_SIDE_LIVE
}/dashboard/membership`;

//PlanPrice
const basic_plan = 3500;
const standard_plan = 9300;
const premium_plan = 17900;

//UpgradePrice
const basic_standard = 5500;
const basic_premium = 14000;
const standard_premium = 8000;

//plan
export const paymentforBasic = async (email, uid, phone, name = null) => {
  try {
    const data = {
      email,
      callback_url,
      amount: +basic_plan * 100,
      metadata: {
        plan: "basic",
        phone,
        username: name,
        upgrade: false,
        user: "merchant",
        userId: uid,
        cancel_action,
      },
    };

    const payment = await paystack(transaction, data);
    return payment?.data?.authorization_url;
    //return "yooo";
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};
export const paymentforStandard = async (email, uid, phone, name = null) => {
  try {
    const data = {
      email,
      callback_url,
      amount: +standard_plan * 100,
      metadata: {
        plan: "standard",
        phone,
        username: name,
        upgrade: false,
        user: "merchant",
        userId: uid,
        cancel_action,
      },
    };

    const payment = await paystack(transaction, data);
    return payment?.data?.authorization_url;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const paymentforPremium = async (email, uid, phone, name = null) => {
  try {
    const data = {
      email,
      callback_url,
      amount: +premium_plan * 100,
      metadata: {
        plan: "premium",
        phone,
        username: name,
        upgrade: false,
        user: "merchant",
        userId: uid,
        cancel_action,
      },
    };

    const payment = await paystack(transaction, data);
    return payment?.data?.authorization_url;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

//upgrade
export const upgradeToStandard = async (email, uid, phone, name = null) => {
  try {
    const data = {
      email,
      callback_url,
      amount: +basic_standard * 100,
      metadata: {
        plan: "standard",
        phone,
        username: name,
        upgrade: true,
        user: "merchant",
        userId: uid,
        cancel_action,
      },
    };

    const payment = await paystack(transaction, data);
    return payment?.data?.authorization_url;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const upgradeFromBasicToPremium = async (
  email,
  uid,
  phone,
  name = null,
) => {
  try {
    const data = {
      email,
      callback_url,
      amount: +basic_premium * 100,
      metadata: {
        plan: "premium",
        phone,
        username: name,
        upgrade: true,
        user: "merchant",
        userId: uid,
        cancel_action,
      },
    };

    const payment = await paystack(transaction, data);
    return payment?.data?.authorization_url;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const upgradeFromStandardToPremium = async (
  email,
  uid,
  phone,
  name = null,
) => {
  try {
    const data = {
      email,
      callback_url,
      amount: +standard_premium * 100,
      metadata: {
        plan: "premium",
        phone,
        username: name,
        upgrade: true,
        user: "merchant",
        userId: uid,
        cancel_action,
      },
    };

    const payment = await paystack(transaction, data);
    return payment?.data?.authorization_url;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};
