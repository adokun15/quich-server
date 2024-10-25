import { paystack, paystack_ } from "../../utils/paystack.js";
import { getSplitAccount } from "../firebase/account.js";
import { getUserDb } from "../firebase/users.js";
export const paymentRequest = async (
  customerInfo,
  { merchantId, items, cartId },
  link
) => {
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

  //get split code
  config.endpoint = "/paymentrequest";
  const merchant = await getUserDb(merchantId).catch((err) => console.log(err));
  const paymentRequestProcess = await paystack(config, {
    line_items: items.map((item) => ({
      id: item?.productId,
      quantity: item.qty,
      name: item.productName,
      amount: +item.price * 100,
    })),
    customer: customer?.customer_code,
    due_date: "2024-11-11",
    split_code: merchant?.account?.splitCode,
    metadata: {
      merchant: {
        id: merchantId,
        name: merchant?.businessName,
        phone: merchant.businessNumber,
      },
      store: link,
      cartId,
    },
  })
    .then((data) => data.data)
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });

  return paymentRequestProcess?.request_code;
  //ConfirmUser

  //Create payment request
};
/*{
  transactions: [],
  subscriptions: [],
  authorizations: [],
  email: 'papi@gmail.com',
  phone: '2348129584035',
  first_name: 'amos',
  integration: 1043425,
  domain: 'test',
  metadata: {},
  customer_code: 'CUS_842cihuvn4j0rlj',
  risk_action: 'default',
  id: 200087139,
  createdAt: '2024-10-24T23:07:13.147Z',
  updatedAt: '2024-10-24T23:07:13.147Z',
  identified: false,
  identifications: null
}*/
