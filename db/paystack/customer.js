import CustomError from "../../utils/error.js";
import { paystack } from "../../utils/paystack.js";

//INITAIE KYC
export const VerifyIdentity = async function (query) {
  const { currency, account_number, bvn, bank_code, first_name, last_name } =
    query;

  const config = {
    method: "GET",
    endpoint: `/customer/${query.customer_code}/identification`,
  };

  const data = await paystack(config, {
    country: currency,
    account_number,
    bvn,
    bank_code,
    first_name,
    last_name,
  });

  if (data?.status) {
    return "KYC Identification In Progress. We will notify you through your verified Whatsapp Phone Number when the verification process is complete.";
  } else {
    throw new CustomError("Error Occured!");
  }
};

export const Customer = async (customerInfo) => {
  //Collect Email/code
  let config = {
    method: "POST",
    endpoint: "/customer",
  };

  let info = {
    email: customerInfo?.email,
    phone: customerInfo?.phone || null,
    first_name: customerInfo?.name,
    last_name: customerInfo?.lname || "",
  };

  //Get Customer;
  const customer = await paystack(config, info);

  const { data, status } = customer;

  if (status) {
    return {
      email: data?.email,
      phone: data?.phone,
      name: data?.first_name,
      customerCode: data?.customer_code,
      createdOn: data?.createdAt,
    };
  }
};
