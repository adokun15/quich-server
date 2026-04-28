import express from "express";
import AsyncError from "../utils/error/AsyncError.js";

import {
  CheckoutOrderController,
  DeleteOrderController,
  getAllOrdersController,
  getOrderController,
  UpdateOrderController,
} from "../controllers/order.js";
import { AuthorizationRouteMiddleware } from "../utils/middleware/Auth.js";
import { ValidateQueryMiddleWare } from "../utils/middleware/VerifyQueryRequest.js";
const orderRoute = express.Router();

//Get Merchant Orders
//orderRoute.use(AuthorizationRouteMiddleware);

orderRoute
  .route("/:orderId")
  //Read by anyone
  //Rate Limit this endpoint!
  .get(AsyncError(getOrderController))
  .patch(AuthorizationRouteMiddleware, AsyncError(UpdateOrderController))
  .delete(AuthorizationRouteMiddleware, AsyncError(DeleteOrderController));

//Read only by merchant on their browser; Must be authorized
orderRoute
  .route("/")
  .get(
    AuthorizationRouteMiddleware,
    ValidateQueryMiddleWare,
    AsyncError(getAllOrdersController),
  )

  //Rate Limit this endpoint!
  //Checkout: Create Customer / Order
  .post(AsyncError(CheckoutOrderController));

export default orderRoute;
