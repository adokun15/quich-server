import {
  BatchAddProductsToCategoryService,
  BatchRemoveProductToCategoryService,
  CreateCategoryService,
  DeleteSingleCategoryService,
  getAllCategoryService,
  getSingleCategoryService,
  updateSingleCategoryService,
} from "../services/categoryService.js";
import { getAllCustomers } from "../services/customers.js";
import CustomError from "../utils/error/error.js";

export const getAllCategoryController = async (req, res, next) => {
  const { store_id } = req?.user;

  if (!store_id) {
    throw new CustomError("Unauthorized Access to Data!", 403);
  }

  try {
    //Validate filter and field
    const category = await getAllCategoryService({ store_id });

    console.log(category);
    res.json({
      data: { category: category.categories, page: 4, total_category: 90 },
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteCategoryController = async (req, res, next) => {
  const { categoryId } = req.params;
  const { store_id } = req.user;

  try {
    const category = await DeleteSingleCategoryService({
      store_id,
      category_id: categoryId,
    });
    res.json({ data: category, staus: true });
  } catch (e) {
    next(e);
  }
};

export const createCategoryController = async (req, res, next) => {
  const { store_id } = req?.user;
  const { name } = req.body;

  if (!store_id) {
    throw new CustomError("Unauthorized Access to Data!", 403);
  }

  if (!name) {
    throw new CustomError("Invalid Name", 400);
  }

  try {
    //Validate filter and field
    const category = await CreateCategoryService({ store_id, name });

    res.json({
      id: category.category?.id,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

export const updateSingleCategoryController = async (req, res, next) => {
  const { updates } = req.body;
  const { categoryId } = req.params;
  const { store_id } = req.user;

  //Validate updates fields
  try {
    const updateCategory = await updateSingleCategoryService({
      category_id: categoryId,
      store_id,
      updates,
    });
    res.json({ data: updateCategory, status: true });
  } catch (e) {
    next(e);
  }
};

export const getSingleCategoryController = async (req, res, next) => {
  //Orders & Customer Details
  const { store_id } = req.user;
  const { categoryId } = req.params;

  if (!store_id) {
    throw new CustomError("Unauthorized Access to Store!", 403);
  }

  try {
    const single_category = await getSingleCategoryService({
      category_id: categoryId,
      store_id,
    });
    res.json({ data: single_category?.category, status: true });
  } catch (e) {
    next(e);
  }
};

//Product update atomicity
export const AddProductToCategoryController = async (req, res, next) => {
  //Orders & Customer Details
  const { store_id } = req.user;
  const { categoryId } = req.params;
  const { product_ids } = req.body;

  if (!store_id) {
    throw new CustomError("Unauthorized Access to Store!", 403);
  }

  if (!product_ids) {
    throw new CustomError("No Product addeed", 403);
  }

  try {
    const res = await BatchAddProductsToCategoryService({
      category_id: categoryId,
      store_id,
      product_ids,
    });

    res.json({ data: res, status: true });
  } catch (e) {
    next(e);
  }
};
export const DeleteProductFromCategoryController = async (req, res, next) => {
  const { store_id } = req.user;
  const { product_ids } = req.body;

  if (!store_id) {
    throw new CustomError("Unauthorized Access to Store!", 403);
  }

  if (!product_ids) {
    throw new CustomError("No Product added", 400);
  }

  try {
    const res = await BatchRemoveProductToCategoryService({
      store_id,
      product_ids,
    });

    res.json({ data: res, status: true });
  } catch (e) {
    next(e);
  }
};
