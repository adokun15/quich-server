import { paystack } from "../../utils/paystack.js";
export const GetSplitCode = async function (name, account) {
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

  return await paystack(config, data)
    .then((data) => data.data)
    .catch((err) => {
      throw new Error(err.message);
    });
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

  return await paystack(config, data)
    .then((data) => data.data)
    .catch((err) => {
      throw new Error(err.message);
    });
};
