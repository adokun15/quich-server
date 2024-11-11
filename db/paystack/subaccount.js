import { paystack } from "../../utils/paystack.js";

export const GetSplitCode = async function (name, account) {
  if (!name || !account) {
    throw new CustomError(data?.message || "SOMETHING WENT WRONG!", 500);
  }

  const config = {
    method: "POST",
    endpoint: "/split",
  };

  const data = {
    name: name,
    type: "percentage",
    currency: "NGN",
    bearer_type: "account",
    subaccounts: [
      {
        subaccount: account,
        share: 95,
      },
    ],
  };

  const info = await paystack(config, data);

  return info?.data || "No Split Code Generated!";
};
export const GetSubAccount = async function (query) {
  const config = {
    method: "POST",
    endpoint: "/subaccount",
  };
  const data = {
    account_number: query?.account_number,
    business_name: query?.business_name,
    bank_code: query?.bank_code,
    percentage_charge: 5, // My Percentage
  };

  const info = await paystack(config, data);

  return info?.data;
};
