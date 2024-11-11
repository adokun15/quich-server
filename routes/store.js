import { getAuth } from "firebase-admin/auth";
import AsyncError from "../utils/AsyncError.js";
import CustomError from "../utils/error.js";

import express from "express";
import getAllStoreProduct, {
  createUserStore,
  getUserStore,
  updateMerchantVisibility,
  updateUserStore,
} from "../db/firebase/store.js";
import { paymentRequest } from "../db/paystack/paymentRequest.js";
const storeRoute = express.Router();

storeRoute.patch(
  "/:storeId/merchant/publish",
  AsyncError(async (req, res, next) => {
    if (!req.params.storeId) {
      throw new CustomError("Invalid store link.");
    }
    const publishFunc = await updateMerchantVisibility(req.params.storeId);
    res.json(publishFunc);
  })
);

storeRoute
  .route("/:store/merchant")
  .get(
    AsyncError(async (req, res) => {
      const store = req.params.store;

      const splitted = store?.includes("_") ? store?.split("_") : null;

      let uid = null;
      let storeLink = "";

      if (splitted) {
        storeLink = splitted[0];
        uid = splitted[1];
      } else {
        storeLink = store;
      }

      const storeMerchant = await getUserStore(storeLink, uid);

      res.json(storeMerchant);
    })
  )
  .post(
    AsyncError(async (req, res, next) => {
      const storeLink = req.params.storeId;

      const token = req.get("Authorization").split(" ")[1];
      const decodedToken = await getAuth().verifyIdToken(token); //uid, email

      if (!storeLink) {
        throw new CustomError("Invalid store link.");
      }
      const Merchant = await createUserStore(
        storeLink,
        decodedToken?.uid,
        req?.body
      );
      res.json(Merchant);
    })
  )
  .patch(
    AsyncError(async (req, res) => {
      const storeLink = req.params.storeId;
      if (!req.body) {
        throw new CustomError("No information provided.");
      }
      if (!storeLink) {
        throw new CustomError("Invalid store link.");
      }
      const updateMerchant = await updateUserStore(storeLink, req?.body);
      res.json(updateMerchant);
    })
  );

storeRoute
  .route("/:storeSlug")
  .get(
    AsyncError(async (req, res) => {
      //Get all product
      const storeLink = req.params.storeSlug;
      const store = await getAllStoreProduct(storeLink);
      res.json(store);
    })
  )
  .post(
    AsyncError(async (req, res, next) => {
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
    })
  );

export default storeRoute;
