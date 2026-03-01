//Process paystack
const secret = `${process.env.PAYSTACK_SECRET_KEY}`;

export const paystack_controller = async (req, res, next) => {
  //Process

  //Respond

  //Use Ip addres
  const { event, data } = req.body;

  if (event === "paymentrequest.pending") {
    //Create new Order
    try {
      await createNewOrder(data);
      return res.status(200).json({ message: "success" });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  if (event === "paymentrequest.success") {
    //update order and product
    try {
      await SuccessOrder(
        data,
        `${data?.metadata?.store}&${data?.metadata?.cartId}`,
      );
      return res.status(200).json({ message: "success" });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  if (event === "charge.success" && !data?.metadata?.user) {
    //Create/update: Customer and transaction
    try {
      await addCustomerTransactions(data);
      return res.status(200).json({ message: "success" });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  if (event === "charge.success" && data?.metadata?.user === "merchant") {
    //One time payment Service
    try {
      await addUserPaymentInfo(data);
      return res.status(200).json({ message: "success" });
    } catch (e) {
      next(e);
    }
  }
  //}
  return res.status(200).end();
};
