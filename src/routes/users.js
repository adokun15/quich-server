import express from "express";
import AsyncError from "../utils/error/AsyncError.js";

import {
  deleteMerchantController,
  UpdateMerchantController,
  ViewMerchantController,
} from "../controllers/merchant.js";
import {
  getUserBillingController,
  PaySubscriptionController,
} from "../controllers/subscription.js";
import { AuthorizationRouteMiddleware } from "../utils/middleware/Auth.js";

const userRoute = express.Router();

//Provide-Uid-Middleware

//userRoute.use(AuthorizationRouteMiddleware);
//Browser (view & Update & Delete) for merchant
userRoute
  .route("/")
  .get(AuthorizationRouteMiddleware, AsyncError(ViewMerchantController))
  .patch(AsyncError(UpdateMerchantController))
  .delete(AsyncError(deleteMerchantController));

userRoute
  .route("/billing")
  .get(AsyncError(getUserBillingController))
  .post(AsyncError(PaySubscriptionController));
export default userRoute;
