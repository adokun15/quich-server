import { getAllCustomers } from "../services/customers.js";
import CustomError from "../utils/error/error.js";
export const getAllCustomersController = async (req, res, next) => {
  const { merchant_id, store_id } = req?.user;

  if (!merchant_id) {
    throw new CustomError("Unauthorized Access to Customers Data!", 403);
  }

  try {
    //Validate filter and field
    const customers = await getAllCustomers({ store_id });

    res.json({
      data: { customers, page: 4, total_customers: 90 },
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

//Blacklist toggle
export const updateCustomerStatus = async (req, res, next) => {};

export const getSingleCustomerController = async (req, res, next) => {
  //Orders & Customer Details
  const merchantId = req?.uid;

  res.json({ customers: "opening" });
  if (!merchantId) {
    throw new CustomError("Unauthorized Access to Customers Data!", 403);
  }
};
