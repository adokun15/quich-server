import { getFirestore } from "firebase-admin/firestore";
import Order from "../../model/order.js";
import { getCustomers } from "../paystack/customer.js";

//Product
const updateMerchantProducts = async (storelink, item, data) => {
  const productRef = getFirestore()
    .collection(`store/${storelink}/products`)
    .doc(`${item.productId}`);

  const updateProductList = await getFirestore().runTransaction(
    async (transaction) => {
      const productDoc = await transaction.get(productRef);

      if (!productDoc.exists) {
        //Set new data,
        throw new Error("Product Not Found!");
      }

      //Update Transaction Only
      if (
        productDoc.data().productQty >= 1 &&
        Number(item.quantity) <= productDoc.data().productQty
      ) {
        transaction.update(productRef, {
          orders: [
            {
              name: data?.name,
              code: data?.code,
              email: data?.email,
              status: data?.status,
              phone: data?.phone,
              paidAt: data?.paidAt,
            },
            ...productDoc?.data()?.orders,
          ],
        });
      }
      //Else NOtify merchant!

      return "Product updated!";
    }
  );

  return updateProductList;
};

//Order
const updateMerchantOrder = async (data, id) => {
  const orderRef = getFirestore()
    .collection(`orders/${data?.metadata?.merchant.id}/transactions`)
    .doc(`${id}`);

  const merchantOrderTransaction = await getFirestore().runTransaction(
    async (transaction) => {
      const OrderDoc = await transaction.get(orderRef);

      if (!OrderDoc.exists) {
        throw new Error("Order Not Found!");
      }

      //Update Transaction Only
      transaction.update(orderRef, {
        status: data?.status,
        pdf_url: data?.pdf_url,
        paidAt: data?.paid_at,
      });

      return "Order updated!";
    }
  );
  return merchantOrderTransaction;
};

export const createNewOrder = async (data) => {
  try {
    //Order Model
    const orderModel = new Order(
      data?.metadata?.cartId,
      data.invoice_number,
      data.amount,
      data?.due_date,
      data?.pdf_url,
      data?.status,
      data?.metadata?.products,
      data?.request_code,
      data?.metadata?.merchant.id,
      data?.customer,
      data?.offline_reference,
      data?.split_code,
      null
    );

    //Retrieve Customer;
    const customer = await getCustomers(data?.metadata?.user);

    //Save to Db
    await getFirestore()
      .collection(`orders/${data?.metadata?.merchant.id}/transactions`)
      .doc(`${data?.metadata?.store}&${data?.metadata?.cartId}`)
      .set({
        customerInfo: {
          ...customer,
        },
        ...orderModel,
        createdOn: data?.created_at,
      });
    return "success";
  } catch (e) {
    throw new Error(e?.message);
  }
};

export const SuccessOrder = async (data, orderDocId) => {
  try {
    //orders
    await updateMerchantOrder(data, orderDocId);

    //Get Customer
    const customer = await getCustomers(data?.metadata?.user);

    //products
    data?.metadata?.products?.forEach(
      async (items) =>
        await updateMerchantProducts(data?.metadata?.store, items, {
          name: customer?.name,
          status: data?.status,
          code: customer?.customerCode,
          email: customer?.email,
          phone: customer?.phone,
          paidAt: data?.paid_at,
        }) //id, qty
    );

    return "success";
  } catch (e) {
    console.log(e);
    throw new Error(e?.message);
  }
};

export const getOrders = async (merchantId) => {
  const ref = getFirestore().collection(`orders/${merchantId}/transactions`);

  let orders = [];

  await ref.get().then((data) => {
    data.forEach((order) => {
      orders.push({ ...order.data(), orderDocId: order.id });
    });
  });

  return { orders };
};
