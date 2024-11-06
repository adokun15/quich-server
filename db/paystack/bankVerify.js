import AsyncError from "../../utils/AsyncError.js";
import { paystack_ } from "../../utils/paystack.js";

//Use {subaccount: in paymentRequest}
export const getBanks = async function () {
  //Run Paystack for Bank
  const config = {
    method: "GET",
    endpoint: "/bank?country=nigeria",
  };

  return await paystack_(config)
    .then((data) => {
      const banks = data.data
        .filter((bank) => !bank.is_deleted && bank.active)
        .map((bank) => {
          return {
            bankName: bank.name,
            bankSlug: bank.slug,
            bankCode: bank.code,
          };
        });
      return banks;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

//Get number and code
export const VerifyBankAccount = async function (query) {
  const config = {
    method: "GET",
    endpoint: `/bank/resolve?account_number=${query.number}&bank_code=${query.code}`,
  };
  return await paystack_(config)
    .then((data) => data.data)
    .catch((err) => {
      throw new Error(err.message);
    });
};
