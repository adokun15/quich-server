import express from "express";

import { getAllCustomers } from "../db/firebase/customers.js";
import AsyncError from "../utils/AsyncError.js";
import CustomError from "../utils/error.js";
import { AuthorizationRouteMiddleware } from "../utils/Auth.js";

const customerRoute = express.Router();

//Provide-Uid-Middleware
customerRoute.use(AuthorizationRouteMiddleware);

customerRoute.route("/").get(
  AsyncError(async (req, res, next) => {
    const merchantId = req?.uid;

    if (!merchantId) {
      throw new CustomError("Unauthorized Access to Customers Data!", 403);
    }
    const customers = await getAllCustomers(merchantId);
    res.json({ customers });
  })
);
export default customerRoute;
