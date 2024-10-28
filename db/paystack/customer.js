import { paystack, paystack_ } from "../../utils/paystack.js";

export const getCustomers = async (code) => {
  let config = {
    method: "GET",
    endpoint: `/customer/${code}`,
  };

  //Get Customer;
  const customer = await paystack_(config)
    .then(({ data }) => {
      //  const currentCustomer = data?.find(customer => customer.id === id);

      return {
        email: data?.email,
        phone: data?.phone,
        name: data?.first_name,
        customerCode: data?.customer_code,
        createdOn: data?.createdAt,
      };
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });

  return customer;
};
export const Customer = async (customerInfo) => {
  //Collect Email/code
  let config = {
    method: "POST",
    endpoint: "/customer",
  };

  let data = {
    email: customerInfo?.email,
    phone: customerInfo?.phone,
    first_name: customerInfo?.name,
  };

  //Get Customer;
  const customer = await paystack(config, data)
    .then((data) => data.data)
    .catch((err) => {
      throw new Error(err.message);
    });

  return customer;
};

/*{
  transactions: [],
  subscriptions: [],
  authorizations: [],
  integration: 1043425,
  domain: 'test',
  metadata: {},
  risk_action: 'default',
  id: 200087139,
  updatedAt: '2024-10-24T23:07:13.147Z',
  identified: false,
  identifications: null
}*/
