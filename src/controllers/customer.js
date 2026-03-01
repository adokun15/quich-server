import CustomError from "../utils/error/error.js";
export const getAllCustomersController = async (req, res, next) => {
  const merchantId = req?.uid;

  if (!merchantId) {
    throw new CustomError("Unauthorized Access to Customers Data!", 403);
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
