import { getAuth } from "firebase-admin/auth";

import express from "express";
import getAllStoreProduct, {
  createUserStore,
  getUserStore,
  updateMerchantVisibility,
  updateUserStore,
} from "../db/firebase/store.js";
import { paymentRequest } from "../db/paystack/paymentRequest.js";
const storeRoute = express.Router();

storeRoute.patch("/:storeId/merchant/publish", async (req, res, next) => {
  try {
    const publishFunc = await updateMerchantVisibility(req.params.storeId);
    res.json(publishFunc);
  } catch (e) {
    console.log(e);
    next(e?.message);
  }
});

storeRoute
  .route("/:storeId/merchant")
  .get(async (req, res) => {
    const storeLink = req.params.storeId;

    const storeMerchant = await getUserStore(storeLink);

    res.json(storeMerchant);
  })
  .post(async (req, res, next) => {
    try {
      const storeLink = req.params.storeId;
      const token = req.get("Authorization").split(" ")[1];
      const decodedToken = await getAuth().verifyIdToken(token); //uid, email

      const Merchant = await createUserStore(
        storeLink,
        decodedToken?.uid,
        req?.body
      );

      res.json(Merchant);
    } catch (e) {
      next(e?.message);
    }
  })
  .patch(async (req, res) => {
    const storeLink = req.params.storeId;

    const updateMerchant = await updateUserStore(storeLink, req?.body);

    res.json(updateMerchant);
  });

storeRoute
  .route("/:storeSlug")
  .get(async (req, res) => {
    //Get all product
    const storeLink = req.params.storeSlug;

    const store = await getAllStoreProduct(storeLink);

    res.json(store);
  })
  .post(async (req, res, next) => {
    try {
      //Checkout
      const storeLink = req.params.storeSlug;

      //checkout: {customer: { email, phone, name}, storeOwner: merchantId, items: [allproduct], cartId}
      const { customer } = req.body;

      const data = {
        items: req.body.items,
        cartId: req.body.cartId,
        merchantId: req.body.merchantId,
      };

      const url = await paymentRequest(customer, data, storeLink);
      res.json({ url: `https://paystack.com/pay/${url}` });
    } catch (e) {
      next(e);
    }
  });

export default storeRoute;
