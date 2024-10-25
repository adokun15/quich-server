import express from "express";
import getAllStoreProduct from "../db/firebase/store.js";
import { paymentRequest } from "../db/paystack/paymentRequest.js";
const storeRoute = express.Router();

storeRoute
  .route("/:storeSlug")
  .get(async (req, res) => {
    //Get all product
    const storeLink = req.params.storeSlug;

    const store = await getAllStoreProduct(storeLink);

    res.json(store);
  })
  .post(async (req, res) => {
    //Checkout
    const storeLink = req.params.storeSlug;

    //checkout: {customer: { email, phone, name}, storeOwner: merchantId, items: [allproduct], cartId}
    const { customer } = req.body;
    //
    const data = {
      items: req.body.items,
      cartId: req.body.cartId,
      merchantId: req.body.merchantId,
    };

    const url = await paymentRequest(customer, data, storeLink);

    res.json({ url: `https://paystack.com/pay/${url}` });
  });

export default storeRoute;
