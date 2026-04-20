import {
  createOrderService,
  DeleteSingleOrder,
  getOrders,
  getSingleOrder,
  updateCustomerOrder,
} from "../services/orders.js";
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

//Add a rate limit for this public api
export const getOrderController = async (req, res, next) => {
  try {
    //Params
    const { store_id } = req.query;
    const { orderId } = req.params;

    if (!store_id || !orderId) {
      throw new CustomError("Invalid parameters!", 400);
    }

    const order = await getSingleOrder({ store_id, order_id: orderId });

    res.json({ order });
  } catch (e) {
    next(e);
  }
};

export const UpdateOrderController = async (req, res, next) => {
  try {
    const { updates } = req.body;
    const { store_id } = req.user;
    const { orderId: order_id } = req.params;

    if (!updates) {
      throw new CustomError("Invalid Request!", 400);
    }
    const order = await updateCustomerOrder({ updates, order_id, store_id });

    res.json({ order: order?.updated_order });
  } catch (e) {
    next(e);
  }
};
export const DeleteOrderController = async (req, res, next) => {
  try {
    const { orderId: order_id } = req.params;
    const { store_id } = req.user;

    const orderId = await DeleteSingleOrder({ store_id, order_id });

    res.json({ orderId });
  } catch (e) {
    next(e);
  }
};

export const CheckoutOrderController = async (req, res, next) => {
  try {
    //Validate Customer Field and make sure all cart field are available;

    const { cart, customer, store_id } = req.body;

    const order = await createOrderService({ cart, customer, store_id });

    //const url = await paymentRequest(customer, data, storeLink);
    res.json({ orderId: order?.orderId });
  } catch (e) {
    next(e);
  }
};
