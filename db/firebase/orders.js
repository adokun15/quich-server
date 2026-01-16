import { getFirestore } from "firebase-admin/firestore";
import Order from "../../model/order.js";
import CustomError from "../../utils/error.js";
import { getAuth } from "firebase-admin/auth";
import { OutOfStock } from "../whatapp/templates/OutOfStock.js";
//import { getUserStore } from "./store.js";
import { newOrder } from "../whatapp/templates/order.js";
import { MakeTransferToRecipient } from "../paystack/receipient.js";

const getUserRole = async (uid) => {
  return await getAuth()
    .getUser(uid)
    .then((user) => {
      if (!user?.customClaims?.role) {
        throw new Error("User Not Found!");
      }
      return user?.customClaims?.role;
    })
    .catch((e) => {
      throw new CustomError(e?.message || "Cant get User Role", 401);
    });
};

const OrderLimit = async (uid) => {
  const todayDate = new Date();

  const ordersRef = getFirestore().collection(`orders/${uid}/transactions`);

  //Run tansaction
  const LengthOfOrderInADay = await getFirestore().runTransaction(
    async (transaction) => {
      const ordersDoc = await transaction.get(ordersRef);

      let orderLength = 0;

      ordersDoc.docs.forEach((order) => {
        const orderDate = new Date(order.data()?.paidAt);

        if (orderDate?.getDate() === todayDate.getDate()) {
          orderLength = orderLength + 1;
        }
      });

      return orderLength;
    },
  );
  return LengthOfOrderInADay;
};

//Product
const updateMerchantProducts = async (storelink, item, data, merchant) => {
  const productRef = getFirestore()
    .collection(`store/${storelink}/products`)
    .doc(`${item.productId}`);

  const updateProductList = await getFirestore().runTransaction(
    async (transaction) => {
      const productDoc = await transaction.get(productRef);

      if (!productDoc.exists) {
        throw new Error("Product Not Found!");
      }

      if (
        productDoc.data().productQty >= 1 &&
        productDoc.data().productQty >= Number(item.quantity)
      ) {
        transaction.update(productRef, {
          productQty: productDoc.data().productQty - Number(item.quantity),
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
      } else {
        //Inform About out-of-stock service!
        await OutOfStock(merchant?.phone, merchant?.name, item?.name);
      }
      return "Product updated!";
    },
  );

  return updateProductList;
};

//Order
const updateMerchantOrder = async (data, id) => {
  //single order
  const orderRef = getFirestore()
    .collection(`orders/${data?.metadata?.merchant.id}/transactions`)
    .doc(`${id}`);

  const merchantOrderTransaction = await getFirestore().runTransaction(
    async (transaction) => {
      const OrderDoc = await transaction.get(orderRef);

      if (!OrderDoc.exists) {
        throw new Error("Order Not Found!");
      }

      //Role ---> fee
      const userRole = OrderDoc.data()?.role;
      let fee = 0.022;

      //Read order limit;
      const LimitForOrder = await OrderLimit(data?.metadata?.merchant.id);

      const actualAmount = data?.amount;

      //Conditions! to send order on whatapp;
      if (userRole === "free" && LimitForOrder <= 50) {
        //await newOrder()
        fee = 0.065;

        await MakeTransferToRecipient(
          data?.metadata?.merchant?.recipient,
          actualAmount * fee,
        );
      }
      if (userRole === "standard" && LimitForOrder <= 500) {
        fee = 0.035;
        await MakeTransferToRecipient(
          data?.metadata?.merchant?.recipient,
          actualAmount * fee,
        );
        //await newOrder()
      }
      if (userRole === "premium") {
        //await newOrder()
        fee = 0.022;
        await MakeTransferToRecipient(
          data?.metadata?.merchant?.recipient,
          actualAmount * fee,
        );
      }

      //Update Transaction Only
      transaction.update(orderRef, {
        fee,
        feeAmount: actualAmount * fee,
        status: data?.status,
        pdf_url: data?.pdf_url,
        paidAt: data?.paid_at,
      });

      return "Order updated!";
    },
  );
  return merchantOrderTransaction;
};

export const createNewOrder = async (data) => {
  try {
    //Using role to get fee charges
    const merchantRoleDuringOrder = data?.metadata?.products[0]?.role;

    //later: seperate your fee from paystack

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
      data?.merchant?.recipient, //Added recipient
      merchantRoleDuringOrder,
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

    //products: works//vheck again
    data?.metadata?.products?.forEach(
      async (item) =>
        await updateMerchantProducts(
          data?.metadata?.store,
          item,
          {
            name: data?.metadata?.user?.name || null,
            status: data?.status,
            code: data?.metadata?.user?.customerCode,
            email: data?.metadata?.user?.email,
            phone: data?.metadata?.user?.phone,
            paidAt: data?.paid_at,
          },
          data?.metadata?.merchant,
        ), //id, qty
    );
    return "success";
  } catch (e) {
    throw new Error(e?.message);
  }
};

export const getOrders = async (merchantId) => {
  try {
    //First list.
    const ref = getFirestore()
      .collection(`orders/${merchantId}/transactions`)
      .orderBy("orderId", "desc");

    //Run tansaction
    const Orders = await getFirestore().runTransaction(async (transaction) => {
      const ordersDoc = await transaction.get(ref);

      if (ordersDoc.empty) {
        throw new CustomError("No Orders yet!", 500);
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
    throw new CustomError(e?.message || e?.code || "Something went wrong", 500);
  }
};
