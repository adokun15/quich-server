import express from "express";
const webhook = express.Router();

//For All end-user
webhook.post("/paystack", (req, res) => {
  //Update order: paymentrequest.success
  const event = req.body;

  console.log(event);

  res.status(200).json({ message: "webhook received!" });
  //Create Customer
  //Update Product
  //Alert Whatapp about new success/failed order.
});

export default webhook;
