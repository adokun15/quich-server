import { createOrderService, getOrders } from "../services/orders.js";
import CustomError from "../utils/error/error.js";

export const getAllOrdersController = async (req, res, next) => {
  const { merchant_id, store_id } = req.user;

  if (!merchant_id || !store_id) {
    throw new CustomError("Unauthorized Access to Order Data!", 403);
  }

  try {
    //Validate filter and field
    const orders = await getOrders({ store_id });

    res.json({
      data: { orders: orders?.orders, page: 4, total_orders: 90 },
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

export const getOrderController = async (req, res, next) => {};
export const UpdateOrderController = async (req, res, next) => {};
export const DeleteOrderController = async (req, res, next) => {};

export const CheckoutOrderController = async (req, res, next) => {
  try {
    //Validate Customer Field and make sure all cart field are available;

    const { cart, customer, store_id } = req.body;

    const order = await createOrderService({ cart, customer, store_id });
    console.log(order);
    //const url = await paymentRequest(customer, data, storeLink);
    res.json({ orderId: "ORDER_123313" });
  } catch (e) {
    next(e);
  }
};
