export const getAllOrdersController = async (req, res, next) => {
  const merchantId = req.uid;

  if (!merchantId) {
    throw new CustomError("Unauthorized Access to Order Data!", 403);
  }

  const orders = await getOrders(merchantId);
  res.json({ orders });
};

export const getOrderController = async (req, res, next) => {};
export const CheckoutOrderController = async (req, res, next) => {
  const storeLink = req.params.storeSlug;
  const { customer } = req.body;
  const data = {
    items: req.body.items,
    cartId: req.body.cartId,
    merchantId: req.body.merchantId,
  };
  const url = await paymentRequest(customer, data, storeLink);
  res.json({ url: `https://paystack.com/pay/${url}`, code: url });
};
