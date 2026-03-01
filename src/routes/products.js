import express from "express";
import AsyncError from "../utils/error/AsyncError.js";

import {
  AddProductImageController,
  DeleteProductController,
  getAllProductsController,
  getProductController,
  UpdateProductController,
} from "../../controllers/products.js";
const productRoute = express.Router();

//Only merchant has access to this;

//A middleware will be passed;

//Access only by merchants

//Only created on whatsapp flow;

productRoute
  .route("/:product_id/logo")
  .post(AsyncError(AddProductImageController))
  .delete(AsyncError(DeleteProductController));

productRoute
  .route("/:product_id")
  .get(AsyncError(getProductController))
  .patch(AsyncError(UpdateProductController))
  .delete(AsyncError(DeleteProductController));

//Read only by merchant on their browser; Must be authorized
productRoute.route("/").get(AsyncError(getAllProductsController));

export default orderRoute;
