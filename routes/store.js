import { getAuth } from "firebase-admin/auth";
import AsyncError from "../utils/AsyncError.js";
import CustomError from "../utils/error.js";

import express from "express";
import getAllStoreProduct, {
  createUserStore,
  getUserStore,
  updateUserStore,
} from "../db/firebase/store.js";
import {
  getCustomerPaymentInformation,
  paymentRequest,
} from "../db/paystack/paymentRequest.js";
import {
  getStoreShippingInformation,
  updateStoreShippingInformation,
} from "../db/firebase/store/shipping.js";
import {
  AddToStoreDeliveryFee,
  DeleteSingleStoreDeliveryFee,
  getStoreDeliveryFee,
  UpdateSingleStoreDeliveryFee,
} from "../db/firebase/store/delivery.js";
import {
  getStoreSuccessMessage,
  updateStoreSuccessMessage,
} from "../db/firebase/store/SuccessMessage.js";
import {
  getStoreCustomizationInfo,
  updateStoreCustomizationInfo,
} from "../db/firebase/store/Appearance.js";
import {
  sendCodeToDestinateUser,
  VerifyCodeFromDestinateUser,
} from "../db/firebase/store/managePhone.js";
import {
  getMerchantVisibility,
  updateMerchantVisibility,
} from "../db/firebase/store/visibility.js";
import { AuthorizationRouteMiddleware } from "../utils/Auth.js";
const storeRoute = express.Router();

//shipping
storeRoute
  .route("/:storeId/merchant/shipping")
  .get(
    AsyncError(async (req, res) => {
      //Get Shipping Info
      const getShippingInfo = await getStoreShippingInformation(
        req.params.storeId
      );
      res.json(getShippingInfo);
    })
  )
  .post(
    AsyncError(async (req, res) => {
      //Update Shipping Info
      const updateShipping = await updateStoreShippingInformation(
        req.params.storeId,
        req.body
      );
      res.json(updateShipping);
    })
  );

//Delivery
storeRoute
  .route("/:storeId/merchant/delivery")
  .get(
    AsyncError(async (req, res) => {
      //Get Delivery Fee List
      const list = await getStoreDeliveryFee(req.params.storeId);
      res.json({ list });
    })
  )
  .post(
    AsyncError(async (req, res) => {
      //addSingle Delivery Fee
      const addToList = await AddToStoreDeliveryFee(
        req.params.storeId,
        req?.body
      );
      res.json(addToList);
    })
  )
  .patch(
    AsyncError(async (req, res) => {
      //update Single Delivery Fee
      const updateList = await UpdateSingleStoreDeliveryFee(
        req.params.storeId,
        req.body
      );
      res.json(updateList);
    })
  )
  .delete(
    AsyncError(async (req, res) => {
      //Delete single Delivery Fee
      const deleteDelivery = await DeleteSingleStoreDeliveryFee(
        req.params.storeId,
        req.body.id
      );
      res.json(deleteDelivery);
    })
  );

//Success Message
storeRoute
  .route("/:storeId/merchant/success_message")
  .get(
    AsyncError(async (req, res) => {
      //Get Success Message
      const getMessage = await getStoreSuccessMessage(req.params.storeId);
      res.json(getMessage);
    })
  )
  .post(
    AsyncError(async (req, res) => {
      //update Success Message
      const setMessage = await updateStoreSuccessMessage(
        req.params.storeId,
        req.body.message
      );
      res.json(setMessage);
    })
  );

//Customization
storeRoute
  .route("/:storeId/merchant/customize")
  .get(
    AsyncError(async (req, res) => {
      //Get Customized Info
      const appearance = await getStoreCustomizationInfo(req.params.storeId);
      res.json(appearance);
    })
  )
  .post(
    AsyncError(async (req, res) => {
      //Update Customized Info
      const setAppearance = await updateStoreCustomizationInfo(
        req.params.storeId,
        req.body
      );
      res.json(setAppearance);
    })
  );

storeRoute
  .route("/:storeId/merchant/publish")
  .get(
    AsyncError(async (req, res) => {
      //Get Publish State
      const getPulishedState = await getMerchantVisibility(req.params.storeId);
      res.json(getPulishedState);
    })
  )
  .patch(
    AsyncError(async (req, res, next) => {
      if (!req.params.storeId) {
        throw new CustomError("Invalid store link.");
      }
      const publishFunc = await updateMerchantVisibility(req.params.storeId);
      res.json(publishFunc);
    })
  );

//Whatsapp Verification
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

//StoreFront
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
