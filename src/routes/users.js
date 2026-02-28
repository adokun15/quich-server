import express from "express";
import AsyncError from "../../utils/error/AsyncError";
import {
  deleteMerchantController,
  UpdateMerchantController,
  ViewMerchantController,
} from "../../controllers/merchant";

const userRoute = express.Router();

//Provide-Uid-Middleware

//userRoute.use(AuthorizationRouteMiddleware);
//Browser (view & Update & Delete) for merchant
userRoute
  .route("/")
  .get(AsyncError(ViewMerchantController))
  .patch(AsyncError(UpdateMerchantController))
  .delete(AsyncError(deleteMerchantController));
export default userRoute;
