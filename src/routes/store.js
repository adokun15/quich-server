import AsyncError from "../utils/error/AsyncError.js";

import express from "express";
import {
  GetAdminStore,
  GetStoreController,
  GetStoreProductsController,
  updateAdminStoreController,
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

//Public accessed store products via slug
storeRoute.get("/:storeId/products", AsyncError(GetStoreProductsController));

//Public accessed store via slug
storeRoute.get("/:storeSlug", AsyncError(GetStoreController));

storeRoute
  .route("/")
  .get(AuthorizationRouteMiddleware, AsyncError(GetAdminStore))
  .patch(AuthorizationRouteMiddleware, AsyncError(updateAdminStoreController));

export default storeRoute;
