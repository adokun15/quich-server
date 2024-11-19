import CustomError from "../../utils/error.js";
import { paystack } from "../../utils/paystack.js";
//Charge
const transaction = {
  method: "POST",
  endpoint: "/transaction/initialize",
};

const callback_url = "";
const cancel_action = "";

//plan
export const paymentforBasic = async (email, uid, phone) => {
  try {
    const data = {
      email,
      callback_url,
      amount: 3500 * 100,
      metadata: {
        plan: "basic",
        phone,
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
export const paymentforStandard = async (email, uid, phone) => {
  try {
    const data = {
      email,
      callback_url,
      amount: 9300 * 100,
      metadata: {
        plan: "standard",
        phone,
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

export const paymentforPremium = async (email, uid, phone) => {
  try {
    const data = {
      email,
      callback_url,
      amount: 17900 * 100,
      metadata: {
        plan: "premium",
        phone,
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
export const upgradeToStandard = async (email, uid, phone) => {
  try {
    const data = {
      email,
      callback_url,
      amount: (9300 - 3500) * 100,
      metadata: {
        plan: "standard",
        phone,
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

export const upgradeFromBasicToPremium = async (email, uid, phone) => {
  try {
    const data = {
      email,
      callback_url,
      amount: (15300 - 3500) * 100,
      metadata: {
        plan: "premium",
        phone,
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

export const upgradeFromStandardToPremium = async (email, uid, phone) => {
  try {
    const data = {
      email,
      callback_url,
      amount: (15300 - 9500) * 100,
      metadata: {
        plan: "premium",
        phone,
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
