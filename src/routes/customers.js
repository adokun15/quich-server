import express from "express";
import AsyncError from "../utils/error/AsyncError.js";
import {
  DeleteCustomerController,
  getAllCustomersController,
  getSingleCustomerController,
  updateCustomerStatus,
} from "../controllers/customer.js";
import { AuthorizationRouteMiddleware } from "../utils/middleware/Auth.js";
//import { AuthorizationRouteMiddleware } from "../utils/middleware/Auth.js";

const customerRoute = express.Router();

//Provide-Uid-Middleware
//customerRoute.use(AuthorizationRouteMiddleware);

/*
  this is only a 'read' authorised route;

  Customer are created temporarily when they create an order,
  with the store_id and phone as a unique val; 
  
  cannot be updated (it can only (be blacklisted or unblacklisted))

  can only be deleted(are hidden) when the store is deleted
*/

customerRoute.get(
  "/",
  AuthorizationRouteMiddleware,
  AsyncError(getAllCustomersController),
);

customerRoute.get(
  "/:customer_id",
  AuthorizationRouteMiddleware,
  AsyncError(getSingleCustomerController),
);

customerRoute.patch(
  "/:customer_id",
  AuthorizationRouteMiddleware,
  AsyncError(updateCustomerStatus),
);

customerRoute.delete(
  "/:customer_id",
  AuthorizationRouteMiddleware,
  AsyncError(DeleteCustomerController),
);
export default customerRoute;
