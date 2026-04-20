import {
  DeleteSingleProductForAdmin,
  EditSingleProductForAdmin,
  getAllProductsForAdmin,
  getSingleProductForAdmin,
} from "../services/products.js";
import CustomError from "../utils/error/error.js";

//Handle filter
export const getAllProductsController = async (req, res, next) => {
  try {
    //Retrieve Mercahnt_id and Store_id from token
    const { merchant_id, store_id } = req.user;

    //Validate filters and search;

    //Get Produsts
    const items = await getAllProductsForAdmin({ store_id });

    res.json({
      data: { products: items?.products, currentPage: 3, totalProduct: 89 },
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

export const getProductController = async (req, res, next) => {
  try {
    //Retrieve Mercahnt_id and Store_id from token
    const { store_id } = req.user;
    const { product_id } = req.params;

    //Validate filters and search;

    //Get Product
    const product = await getSingleProductForAdmin({ store_id, product_id });

    res.json({
      data: product,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};
export const DeleteProductController = async (req, res, next) => {
  try {
    //Retrieve Store_id from token
    const { store_id } = req.user;
    const { product_id } = req.params;

    //Update Product
    const response = await DeleteSingleProductForAdmin({
      store_id,
      product_id,
    });

    res.json({
      data: response,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

//Visibility, low-stock/high-demand/newest-incoming/discount
export const UpdateProductController = async (req, res, next) => {
  try {
    //Retrieve Store_id from token
    const { store_id } = req.user;
    const { product_id } = req.params;
    const { updates } = req.body;

    console.log(updates);

    //Validate update data;
    if (!updates) {
      throw new CustomError("Invalid Input", 400);
    }

    //Update Product
    const product = await EditSingleProductForAdmin({
      store_id,
      updates,
      product_id,
    });

    res.json({
      data: product,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

//Add Image by Browser;
export const AddProductImageController = async (req, res, next) => {};
export const DeleteProductImageController = async (req, res, next) => {};
