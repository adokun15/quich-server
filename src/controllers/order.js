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

  let filters = req.query;

  if (filters?.page) {
    filters.offset = Number(filters?.page) - 1;
  }

  try {
    const orders = await getOrders({ store_id, filters });

    res.json({
      data: {
        orders: orders?.orders,
        page: filters?.page || 1,
        total_orders: orders?.total_amount,
      },
      status: true,
    });
  } catch (e) {
    //console.log(e);
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

    res.json({ order, status: true });
  } catch (e) {
    next(e);
  }
};

export const UpdateOrderController = async (req, res, next) => {
  try {
    const { updates, customer_id } = req.body;
    const { store_id } = req.user;
    const { orderId: order_id } = req.params;

    if (!updates) {
      throw new CustomError("Invalid Request!", 400);
    }
    const order = await updateCustomerOrder({
      updates,
      customer_id,
      order_id,
      store_id,
    });

    res.json({ order: order?.updated_order, status: true });
  } catch (e) {
    console.log(e);
    next(e);
  }
};
export const DeleteOrderController = async (req, res, next) => {
  try {
    const { orderId: order_id } = req.params;
    const { store_id } = req.user;
    const { customer_id } = req.body;

    if (!customer_id) {
      throw new CustomError("Invalid request!", 400);
    }

    const orderId = await DeleteSingleOrder({
      store_id,
      order_id,
      customer_id,
    });

    res.json({ orderId, status: true });
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
