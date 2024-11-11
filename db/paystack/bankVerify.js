import CustomError from "../../utils/error.js";
import { paystack_ } from "../../utils/paystack.js";

//Use {subaccount: in paymentRequest}
export const getBanks = async function () {
  //Run Paystack for Bank

  const config = {
    method: "GET",
    endpoint: "/bank?country=nigeria",
  };

  const data = await paystack_(config);

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
};

//Get number and code
export const VerifyBankAccount = async function (query) {
  if (!query.number || !query.code) {
    throw new CustomError("Invalid Input", 400);
  }
  const config = {
    method: "GET",
    endpoint: `/bank/resolve?account_number=${query.number}&bank_code=${query.code}`,
  };
  const data = await paystack_(config);

  return data.data;
};
