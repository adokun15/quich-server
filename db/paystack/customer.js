import { paystack } from "../../utils/paystack.js";

export const Customer = async (customerInfo) => {
  //Collect Email/code
  let config = {
    method: "POST",
    endpoint: "/customer",
  };

  let info = {
    email: customerInfo?.email,
    phone: customerInfo?.phone,
    first_name: customerInfo?.name,
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
