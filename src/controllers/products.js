import {
  CreateProductForAdmin,
  DeleteSingleProductForAdmin,
  EditSingleProductForAdmin,
  getAllProductsForAdmin,
  getSingleProductForAdmin,
} from "../services/products.js";
import CustomError from "../utils/error/error.js";
import ValidationError from "../utils/error/ValidationError.js";

//Handle filter
export const getAllProductsController = async (req, res, next) => {
  try {
    //Retrieve Mercahnt_id and Store_id from token
    const { store_id } = req.user;
    let filter = req.query;

    //Rewrite
    if (filter?.page) {
      filter["offset"] = Number(filter?.page) - 1;
    }

    //Get Produsts
    const items = await getAllProductsForAdmin({
      store_id,
      filter: filter,
    });

    res.json({
      data: {
        products: items?.products,
        currentPage: filter?.page,
        totalProduct: items?.total_count,
      },
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

export const AddProductController = async (req, res, next) => {
  try {
    const { store_id } = req.user;
    const { description, name, price, quantity } = req.body;

    console.log(req.body);
    if (!req.body) {
      throw new ValidationError("Error: Bad request!", 400);
    }
    //Validate
    let errors = [];

    if (!name) {
      errors.push({ field: "name", message: "Invalid name" });
    }

    if (
      isNaN(price) &&
      !(Number(price) <= 100_000_000 && Number(price) >= 10)
    ) {
      errors.push({
        field: "price",
        message: `Invalid price amount. ${Number(price) < 10 ? "value too low" : ""}`,
      });
    }

    if (description.length > 0 && description?.length > 300) {
      errors.push({ field: "desc", message: "Description is too long!" });
    }

    if (
      quantity >= 0 &&
      isNaN(quantity) &&
      !(Number(quantity) <= 1000 && Number(price) >= 1)
    ) {
      errors.push({
        field: "quantity",
        message: `Invalid quantity amount. ${Number(quantity) > 1000 ? "Value is too high" : ""}`,
      });
    }

    if (errors.length > 0) {
      throw new ValidationError("Error", 400, errors);
    }

    //Update Product

    const product_id = await CreateProductForAdmin({
      store_id,
      data: {
        description,
        name,
        price,
        quantity,
      },
    });

    res.json({
      data: product_id,
      status: true,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

//Add Image by Browser;
export const AddProductImageController = async (req, res, next) => {};
export const DeleteProductImageController = async (req, res, next) => {};
