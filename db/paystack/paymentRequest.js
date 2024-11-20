import CustomError from "../../utils/error.js";
import { paystack } from "../../utils/paystack.js";
import { getUserStore } from "../firebase/store.js";
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

  const oneWeek = new Date();

  oneWeek.setMilliseconds(1000 * 60 * 60 * 24 * 7);

  try {
    //merchant
    const merchant = await getUserStore(link);

    const user = await getUserDb(merchantId);

    //user//edi later
    const customer = await Customer(customerInfo);

    const data = {
      line_items: items.map((item) => ({
        quantity: item?.qty,
        name: item?.productName,
        amount: item?.price * 100,
      })),
      due_date: oneWeek.toISOString(),
      //remove comment later
      customer: customer?.customerCode,
      split_code: user?.splitCode,
      metadata: {
        merchant: {
          id: merchantId,
          phone: merchant?.phone,
          name: merchant?.businessName,
        },
        store: link,
        user: { ...customer },
        cartId,
        products: items.map((item) => ({
          productId: item?.productId,
          quantity: item?.qty,
          name: item?.productName,
          amount: item?.total,
        })),
      },
    };
    console.log(data);
    const paymentRequestProcess = await paystack(config, data);

    return paymentRequestProcess?.data?.request_code;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};
