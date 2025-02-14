import { getAuth } from "firebase-admin/auth";
import AsyncError from "../utils/AsyncError.js";
import CustomError from "../utils/error.js";

import express from "express";
import getAllStoreProduct, {
  createUserStore,
  getUserStore,
  sendCodeToDestinateUser,
  updateMerchantVisibility,
  updateUserStore,
  VerifyCodeFromDestinateUser,
} from "../db/firebase/store.js";
import {
  getCustomerPaymentInformation,
  paymentRequest,
} from "../db/paystack/paymentRequest.js";
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

storeRoute.get(
  "/:store/merchant/phone/:code",
  AsyncError(async (req, res) => {
    //Receive and verify code
    const store = req.params.store;
    const code = req.params.code;

    const mes = await VerifyCodeFromDestinateUser(store, code);

    res.json({ message: "Verified" });
  })
);
//Send Code to User
storeRoute.post(
  "/:store/merchant/phone",
  AsyncError(async (req, res) => {
    const store = req.params.store;

    const mes = await sendCodeToDestinateUser(store, req.body?.phone);
    console.log(mes);

    res.json({ message: "Sent" });
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
      const storeLink = req.params.store;

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
      const store = req.params.store;

      if (!req.body) {
        throw new CustomError("No information provided.");
      }
      if (!store) {
        throw new CustomError("Invalid store link.");
      }
      const updateMerchant = await updateUserStore(store, req?.body);
      res.json(updateMerchant);
    })
  );

//payment Information;
storeRoute.get(
  "/:paymentCode/payment",
  AsyncError(async (req, res) => {
    const prq = req.params.paymentCode;
    console.log(prq);
    const paymentInfo = await getCustomerPaymentInformation(prq);
    res.json(paymentInfo);
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
      const { customer } = req.body;
      const data = {
        items: req.body.items,
        cartId: req.body.cartId,
        merchantId: req.body.merchantId,
      };
      const url = await paymentRequest(customer, data, storeLink);
      res.json({ url: `https://paystack.com/pay/${url}`, code: url });
    })
  );

export default storeRoute;
