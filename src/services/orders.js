//Order Business Logic

//Check Order Limit;
//Check merchant tier for automatic order: Free|business|premium;

//Create Order: Checkout ( Rate Limited | Ip-Check);

//Update Order: Date of Delivery and Address(Role-merchant | authorized);
//-- Webhook: Acknowledge Order and Rejected Order (with reason);
//Get Orders / Get Order;

import CustomError from "../utils/error/error";

//Monitor daily order limit
export const OrderLimit = async (uid) => {
  /*
      const ordersDoc = await transaction.get(ordersRef);

      let orderLength = 0;

      ordersDoc.docs.forEach((order) => {
        const orderDate = new Date(order.data()?.paidAt);

        if (orderDate?.getDate() === todayDate.getDate()) {
          orderLength = orderLength + 1;
        }
      });
      
      return orderLength;

      */
};

//Create by customer
export const createOrder = () => {
  //Auth: Device id, ips address and rate limit 1request/5mins
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
};

//Updated by webhook/merchant
const updateCustomerOrder = async () => {
  //webhook: Acknowledge/reject;
  //merchant: add optional address;
};

//get a queried list of orders;
export const getOrders = async (store_id) => {
  //Accessable by merchants only;
};

//accessible by anyone:
export const getSingleOrder = async (store_id) => {
  //Auth: Device id, ips address and rate limit 1request/1sec
};
