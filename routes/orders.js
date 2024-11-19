import express from "express";
import { getOrders } from "../db/firebase/orders.js";
import { AuthorizationRouteMiddleware } from "../utils/Auth.js";
import AsyncError from "../utils/AsyncError.js";
import CustomError from "../utils/error.js";
const orderRoute = express.Router();

//Get Merchant Orders
orderRoute.use(AuthorizationRouteMiddleware);

orderRoute.route("/").get(
  AsyncError(async (req, res, next) => {
    const merchantId = req.uid;

    if (!merchantId) {
      throw new CustomError("Unauthorized Access to Order Data!", 403);
    }

    const orders = await getOrders(merchantId);
    res.json({ orders });
  })
);

export default orderRoute;
