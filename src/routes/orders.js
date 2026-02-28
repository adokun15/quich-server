import express from "express";
import AsyncError from "../utils/AsyncError.js";
import {
  CheckoutOrderController,
  getAllOrdersController,
  getOrderController,
} from "../controllers/order.js";
const orderRoute = express.Router();

//Get Merchant Orders
//orderRoute.use(AuthorizationRouteMiddleware);

//Read by anyone
orderRoute.get("/:orderId", AsyncError(getOrderController));

//Read only by merchant on their browser; Must be authorized
orderRoute
  .route("/")
  .get(AsyncError(getAllOrdersController))

  //Checkout: Create Customer / Order
  .post(AsyncError(CheckoutOrderController));

export default orderRoute;
