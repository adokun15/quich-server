import AsyncError from "../utils/error/AsyncError.js";

import express from "express";
import {
  GetStoreController,
  GetStoreProductsController,
  updateStoreController,
} from "../controllers/store.js";
import { AuthorizationRouteMiddleware } from "../utils/middleware/Auth.js";

const storeRoute = express.Router();

/**
 This Route does limit this; 
 -Allow anyone view a merchant store;
 -Allow user update their store;
 */

/*
 Add a rate limit to both public api and a verify middleware
 */
storeRoute.get("/:storeId/products", AsyncError(GetStoreProductsController));

//Fetch store base on user type;
storeRoute
  .route("/:storeSlug")
  .get(AsyncError(GetStoreController))
  //Might Be Needed by the browser to update

  //Add a verify token function here;
  .patch(AuthorizationRouteMiddleware, AsyncError(updateStoreController));

export default storeRoute;
