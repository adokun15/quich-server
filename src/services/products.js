//Basic 'add product';
//Delete, Update, Access;

import {
  CreateProduct,
  DeleteProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
} from "../repository/products.js";
import CustomError from "../utils/error/error.js";

export const CreateProductForAdmin = async function ({ store_id, data }) {
  try {
    //Create Product for user: Later if user want to create on browser
    const res = await CreateProduct({
      store_id,
      desc: data.description,
      name: data.name,
      price: data.price,
      quantity: data?.quantity,
    });

    //Return product
    return res;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

//Product visibility for store access;
export const EditSingleProductForAdmin = async function ({
  store_id,
  updates,
  product_id,
}) {
  try {
    const updated_data = await updateProduct({ product_id, store_id, updates });
    return updated_data;
  } catch (err) {
    throw new CustomError(err?.message);
  }
};

//DELETE PRODUCT:
export const DeleteSingleProductForAdmin = async function ({
  store_id,
  product_id,
}) {
  try {
    const products = await DeleteProduct({
      product_id,
      store_id,
    });
    return products;
  } catch (e) {
    console.log(e);
    throw new CustomError(e);
  }
};

//all product
export const getAllProductsForAdmin = async function ({ store_id, filter }) {
  try {
    const products = await getProducts({
      ...filter,
      store_id,
    });
    return products;
  } catch (e) {
    throw new CustomError(e);
  }
};

//single product
export const getSingleProductForAdmin = async function ({
  store_id,
  product_id,
}) {
  try {
    const products = await getSingleProduct({
      product_id,
      store_id,
    });
    return products;
  } catch (e) {
    throw new CustomError(e);
  }
};
