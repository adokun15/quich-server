import express from "express";

import { getAllCustomers } from "../db/firebase/customers.js";
import AsyncError from "../utils/AsyncError.js";
import CustomError from "../../utils/error/error.js";
import { AuthorizationRouteMiddleware } from "../../utils/middleware/Auth.js";

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
