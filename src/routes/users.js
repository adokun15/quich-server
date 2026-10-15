import express from "express";
import AsyncError from "../utils/error/AsyncError.js";

import {
  deleteMerchantController,
  UpdateMerchantController,
  ViewMerchantController,
} from "../controllers/merchant.js";
import {
  //disableSubcriptionController,
  getSingleUserInvoiceController,
  getUserBillingController,
  getUserInvoicesController,
  getUserPaymentsController,
  manageSubcriptionController,
  PaySubscriptionController,
  VerifySubscriptionPaymentController,
} from "../controllers/subscription.js";
import { AuthorizationRouteMiddleware } from "../utils/middleware/Auth.js";

const userRoute = express.Router();

//Provide-Uid-Middleware

//userRoute.use(AuthorizationRouteMiddleware);
//Browser (view & Update & Delete) for merchant:
userRoute
  .route("/")
  .all(AuthorizationRouteMiddleware)
  .get(AsyncError(ViewMerchantController))
  .patch(AsyncError(UpdateMerchantController))
  .delete(AsyncError(deleteMerchantController));

userRoute.get(
  "/billing/payments",
  AuthorizationRouteMiddleware,
  AsyncError(getUserPaymentsController),
);

userRoute.get(
  "/billing/invoices",
  AuthorizationRouteMiddleware,
  AsyncError(getUserInvoicesController),
);

userRoute.get(
  "/billing/invoices/:invoice_code",
  AuthorizationRouteMiddleware,
  AsyncError(getSingleUserInvoiceController),
);

/*
userRoute.post(
  "/billing/disable",
  AuthorizationRouteMiddleware,
  AsyncError(disableSubcriptionController),
);
*/

userRoute.get(
  "/billing/manage/:sub_code",
  AuthorizationRouteMiddleware,
  AsyncError(manageSubcriptionController),
);

userRoute.get(
  "/billing/verify/:reference",
  AuthorizationRouteMiddleware,
  AsyncError(VerifySubscriptionPaymentController),
);

userRoute
  .route("/billing")
  .all(AuthorizationRouteMiddleware)
  .get(AsyncError(getUserBillingController))
  .post(AsyncError(PaySubscriptionController));

export default userRoute;
