import express from "express";
import AsyncError from "../utils/error/AsyncError.js";
import { AuthorizationRouteMiddleware } from "../utils/middleware/Auth.js";
import {
  AddProductToCategoryController,
  createCategoryController,
  deleteCategoryController,
  DeleteProductFromCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
  updateSingleCategoryController,
} from "../controllers/category.js";

const categoryRoute = express.Router();

categoryRoute
  .route("/")
  .all(AuthorizationRouteMiddleware)
  .get(AsyncError(getAllCategoryController))
  .post(AsyncError(createCategoryController));

categoryRoute
  .route("/:categoryId/products")
  .all(AuthorizationRouteMiddleware)
  .delete(AsyncError(DeleteProductFromCategoryController))
  .post(AsyncError(AddProductToCategoryController));

categoryRoute
  .route("/:categoryId")
  .all(AuthorizationRouteMiddleware)
  .get(AsyncError(getSingleCategoryController))
  .delete(AsyncError(deleteCategoryController))
  .patch(AsyncError(updateSingleCategoryController));

export default categoryRoute;
