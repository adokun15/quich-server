import { getFirestore } from "firebase-admin/firestore";
import Order from "../../model/order.js";
import CustomError from "../../utils/error.js";

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
        productDoc.data().productQty >= Number(item.qty)
      ) {
        transaction.update(productRef, {
          productQty: productDoc.data().productQty - Number(item.qty),
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
      data.amount / 100,
      data?.due_date,
      data?.pdf_url,
      data?.status,
      data?.metadata?.products,
      data?.request_code,
      data?.metadata?.merchant.id,
      data?.metadata?.user,
      data?.offline_reference,
      data?.split_code
    );

    //Save to Db
    await getFirestore()
      .collection(`orders/${data?.metadata?.merchant.id}/transactions`)
      .doc(`${data?.metadata?.store}&${data?.metadata?.cartId}`)
      .set({
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
    //orders: works
    await updateMerchantOrder(data, orderDocId);

    //products: works
    data?.metadata?.products?.forEach(
      async (items) =>
        await updateMerchantProducts(data?.metadata?.store, items, {
          name: data?.metadata?.user?.name || null,
          status: data?.status,
          code: data?.metadata?.user?.customerCode,
          email: data?.metadata?.user?.email,
          phone: data?.metadata?.user?.phone,
          paidAt: data?.paid_at,
        }) //id, qty
    );
    return "success";
  } catch (e) {
    throw new Error(e?.message);
  }
};

export const getOrders = async (merchantId) => {
  try {
    const ref = getFirestore().collection(`orders/${merchantId}/transactions`);
    //Run tansaction
    const Orders = await getFirestore().runTransaction(async (transaction) => {
      const ordersDoc = await transaction.get(ref);

      if (ordersDoc.empty) {
        throw new CustomError("No Orders yet!");
      }

      let list = [];
      //Get all customer
      ordersDoc.docs.forEach((order) => {
        list.push({ ...order.data(), orderDocId: order.id });
      });
      return list;
    });

    return Orders;
  } catch (e) {
    throw new CustomError(e?.message || e?.code);
  }
};
