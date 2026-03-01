import express from "express";
import AsyncError from "../utils/error/AsyncError.js";
import {
  getAllCustomersController,
  getSingleCustomerController,
  updateCustomerStatus,
} from "../controllers/customer.js";
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

customerRoute.get("/", AsyncError(getAllCustomersController));

customerRoute.get("/:customer_id", AsyncError(getSingleCustomerController));

customerRoute.post("/:customer_id", AsyncError(updateCustomerStatus));
export default customerRoute;
