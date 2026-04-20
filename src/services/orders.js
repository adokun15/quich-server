//Order Business Logic

//Check merchant tier for automatic order: Free|business|premium;

//Create Order: Checkout ( Rate Limited | Ip-Check);

//Update Order: Date of Delivery and Address(Role-merchant | authorized);
//-- Webhook: Acknowledge Order and Rejected Order (with reason);
//Get Orders / Get Order;

import { CreateCustomerforDb } from "../repository/customers.js";
import {
  CreateOrderRepository,
  DeleteOrderFromDb,
  getOrderDetailsFromDb,
  getOrdersFromDb,
  UpdateOrderForDb,
} from "../repository/orders.js";
import CustomError from "../utils/error/error.js";
import { CreateCustomerForStore } from "./customers.js";
import { getMerchantInfo } from "./users.js";

//Monitor daily order limit by a customer in a day; 10 to prevent spam
export const OrderLimit = async (uid) => {};

//Create by customer;
export const createOrderService = async ({
  cart,
  customer,
  // total_amount,
  store_id,
  // merchant_id,
}) => {
  //Auth: Device id, ips address and rate limit 1request/5mins

  try {
    //Check on the Db If  qty > available_quantity;

    //Find Customer
    const customerRes = await CreateCustomerForStore({
      phone: customer?.phone,
      name: customer?.name,
      store_id,
      //    merchant_id,
    });

    console.log("Customer :", customerRes);

    //Create Order
    const res = await CreateOrderRepository({
      cart_items: JSON.stringify(cart),
      customer_id: customerRes?.customer_id,
      total_amount: cart?.reduce((acc, cur) => acc + cur?.total, 0),
      store_id,
    });

    console.log("Order :", res);

    //Check if Merchant_balnace is enough to send a notication
    //const merchantData = await getMerchantInfo(merchant_id);

    // if (merchantData && merchantData?.credits >= 10) {
    //Send notication to user
    //Dedect 10 credit score: For Order Notification;
    //}

    return res; //OrderId;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

//Updated by webhook/merchant
export const updateCustomerOrder = async ({ updates, order_id }) => {
  //webhook: Acknowledge/reject;
  //merchant: add optional address;
  try {
    const updated_order = await UpdateOrderForDb({ updates, order_id });
    return { updated_order };
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

//get a queried list of orders;

//Get Order bys customers  / Stores
export const getOrders = async ({ store_id, filters }) => {
  //Accessable by merchants only;

  //Set Filter From CONTROLLERS;
  try {
    const orders = await getOrdersFromDb({ store_id, ...filters });
    return orders;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

//accessible by anyone:
export const getSingleOrder = async ({ store_id, order_id }) => {
  //Auth: Device id, ips address and rate limit 1request/1sec
  try {
    const order = await getOrderDetailsFromDb({ store_id, order_id });
    return order;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

//Deletion by merchant:
export const DeleteSingleOrder = async ({ store_id, order_id }) => {
  //Auth: Device id, ips address and rate limit 1request/1sec
  try {
    const orderId = await DeleteOrderFromDb({ store_id, order_id });
    return orderId;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

/*
    (
      data?.metadata?.cartId,
      data?.metadata?.products,
      
       //data.invoice_number,
      data.amount / 100,
      data?.due_date,
      data?.pdf_url,
      data?.status,
      data?.request_code,
      data?.metadata?.merchant.id,
      data?.metadata?.user,
      data?.offline_reference,
      data?.merchant?.recipient, //Added recipient
      merchantRoleDuringOrder,
    )*/
