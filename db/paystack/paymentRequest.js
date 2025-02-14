import CustomError from "../../utils/error.js";
import { paystack, paystack_ } from "../../utils/paystack.js";
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

  const payment_confirm_url = `${
    process.env.NODE_ENV === "development"
      ? process.env.MY_URL_CLIENT_SIDE_DEV
      : process.env.MY_URL_CLIENT_SIDE_LIVE
  }/store/${link}/payment-confirmation`;

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
      callback_url: payment_confirm_url,
      due_date: oneWeek.toISOString(),
      customer: customer?.customerCode,
      split_code: user?.splitCode,
      metadata: {
        cancel_action: payment_confirm_url,
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
          actualProfitAmount: item?.actualProfitAmount,
          quantity: item?.qty,
          name: item?.productName,
          amount: item?.total,
        })),
      },
    };

    const paymentRequestProcess = await paystack(config, data);

    return paymentRequestProcess?.data?.request_code;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const getCustomerPaymentInformation = async (prqCode) => {
  let config = {
    method: "GET",
    endpoint: `/paymentrequest/${prqCode}`,
  };
  try {
    const paymentRequestInfo = await paystack_(config);
    const payment = paymentRequestInfo;
    return {
      status: payment?.status,
      paid: payment?.paid,
      paidAt: payment?.paid_at,
      amount: payment.amount / 100,
      items: payment?.metadata?.products,
      customer: payment?.metadata?.user,
      invoicePdf: payment?.pdf_url,
      requestCode: payment?.request_code,
      currency: payment?.currency,
      orderId: payment?.metadata?.cartId,
      merchant: {
        ...payment?.metadata?.merchant,
        storeId: payment?.metadata?.store,
      },
    };
  } catch (e) {
    console.log(e);
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};
