import AsyncError from "../utils/AsyncError.js";

import express from "express";
import {
  GetStoreController,
  updateStoreController,
} from "../../controllers/store.js";

const storeRoute = express.Router();

/**
 This Route does limit this; 

 -Allow anyone view a merchant store;
 -Allow user update their store;
 */

//Fetch store base on user type;
storeRoute
  .route("/:storeSlug")
  .get(AsyncError(GetStoreController))
  //Might Be Needed by the browser to update

  //Add a verify token function here;
  .patch(AsyncError(updateStoreController));

export default storeRoute;
