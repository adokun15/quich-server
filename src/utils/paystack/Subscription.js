import CustomError from "../error/error.js";
import { paystack, paystack_ } from "./paystack.js";

export const disableSubscriptionFromPaystack = async ({
  sub_code,
  email_token,
}) => {
  let config = {
    method: "POST",
    endpoint: "/subscription/disable",
  };

  try {
    const data = {
      sub_code,
      token: email_token,
    };
    const sub = await paystack(config, data);
    return sub?.status;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const enableSubscriptionFromPaystack = async ({
  sub_code,
  email_token,
}) => {
  let config = {
    method: "POST",
    endpoint: "/subscription/enable",
  };

  try {
    const data = {
      sub_code,
      token: email_token,
    };
    const sub = await paystack(config, data);
    return sub?.status;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const FetchSubscriptionFromPaystack = async ({ sub_code }) => {
  let config = {
    method: "GET",
    endpoint: `/subscription/${sub_code}`,
  };

  try {
    const sub = await paystack_(config);
    return {
      sub_code: sub?.data?.subscription_code,
      status: sub?.data?.status,
      next_payment_date: sub?.data?.next_payment_date,
    };
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const StartSubscription = async ({ email, amount, plan }) => {
  let config = {
    method: "POST",
    endpoint: `/transaction/initialize`,
  };

  try {
    const data = {
      email,
      amount,
      plan,
      channels: ["card", "bank", "bank_transfer"],
      callback_url: "/admin/billing",
      metadata: {
        merchant_id: "",
      },
    };

    const sub = await paystack(config, data);

    return {
      sub_url: sub?.data?.authorization_url,
    };
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};
