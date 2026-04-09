import { getAllProductsForAdmin } from "../services/products.js";

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

export const getProductController = async (req, res, next) => {};
export const DeleteProductController = async (req, res, next) => {};

//Visibility, low-stock/high-demand/newest-incoming/discount
export const UpdateProductController = async (req, res, next) => {};

//Add Image by Browser;
export const AddProductImageController = async (req, res, next) => {};
export const DeleteProductImageController = async (req, res, next) => {};
