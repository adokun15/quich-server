import { paystack, paystack_ } from "../../utils/paystack.js";
import { getUserDb } from "../firebase/users.js";
import { Customer } from "./customer.js";
export const paymentRequest = async (
  customerInfo,
  { merchantId, items, cartId },
  link
) => {
  let config = {
    method: "POST",
    endpoint: "/paymentrequest",
  };
  try {
    //merchant
    const merchant = await getUserDb(merchantId).catch((err) =>
      console.log(err)
    );
    //user
    const customer = await Customer(customerInfo);

    const data = {
      line_items: items.map((item) => ({
        //id: item?.productId,
        quantity: item?.qty,
        name: item?.productName,
        amount: item?.total,
      })),
      due_date: "2024-11-11",
      //remove comment later
      // split_code: merchant?.splitCode,
      metadata: {
        merchant: {
          id: merchantId,
          name: merchant?.businessName,
          phone: merchant.businessNumber,
        },
        user: customer?.customer_code,
        store: link,
        cartId,
        products: items.map((item) => ({
          productId: item?.productId,
          quantity: item.qty,
          name: item.productName,
          amount: item.total,
        })),
      },
    };

    const paymentRequestProcess = await paystack(config, data);

    console.log(paymentRequestProcess);
    // })
    //   .then((data) => data.data)
    //  .catch((err) => {
    //    console.log(err);
    // throw new Error(err.message);
    // }
    //Customer

    //console.log(customer);
    //console.log(items);
    //get split code
    //  const merchant = await getUserDb(merchantId).catch((err) => console.log(err));

    //return paymentRequestProcess?.request_code;
  } catch (e) {
    console.log(e);
    throw new Error(e?.message || "Something went wrong!!");
  }
  return "love";
};
