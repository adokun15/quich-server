import {
  CreateCategoryRepository,
  DeleteCategory,
  getCategoriesFromDb,
  getSingleCategory,
  updateCategory,
  UpdateProductsToCategoryRepository,
} from "../repository/categories.js";
import CustomError from "../utils/error/error.js";

//Manage Category
export const getSingleCategoryService = async ({ category_id, store_id }) => {
  try {
    const category = await getSingleCategory({ store_id, category_id });

    return category;
  } catch (e) {
    throw new CustomError(e.message);
  }
};
export const getAllCategoryService = async ({ filter, store_id }) => {
  try {
    //Filter: category_name, invisible, OrderBy, direction
    const get_category = await getCategoriesFromDb({ store_id, ...filter });
    return get_category;
  } catch (e) {
    throw new CustomError(e.message);
  }
};

export const DeleteSingleCategoryService = async ({
  category_id,
  store_id,
}) => {
  try {
    const deleted_category = await DeleteCategory({ category_id, store_id });
    return deleted_category;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};
export const updateSingleCategoryService = async ({
  store_id,
  category_id,
  updates,
}) => {
  try {
    const new_slug =
      updates?.name && typeof updates?.name === "string"
        ? updates?.name?.split(" ").join("_").toLowerCase()
        : null;

    const updated_data = await updateCategory({
      new_slug,
      updates,
      category_id,
      store_id,
    });
    return updated_data;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

//Manage group of products;
export const BatchAddProductsToCategoryService = async ({
  store_id,
  product_ids,
  category_id,
}) => {
  try {
    const updated_data = await UpdateProductsToCategoryRepository({
      store_id,
      product_ids,
      category_id,
    });
    return updated_data;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

export const BatchRemoveProductToCategoryService = async ({
  product_ids,
  store_id,
}) => {
  try {
    const updated_data = await UpdateProductsToCategoryRepository({
      store_id,
      product_ids,
      category_id: null,
    });
    return updated_data;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

//create category
export const CreateCategoryService = async ({ name, store_id }) => {
  try {
    const slug =
      typeof name === "string" && name?.split(" ").join("_").toLowerCase();

    const createData = await CreateCategoryRepository({
      store_id,
      slug,
      category_name: name,
    });

    return createData; //Id and Slug
  } catch (e) {
    throw new CustomError(e?.message);
  }
};
