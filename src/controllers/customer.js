import {
  deleteCustomerFromStore,
  EditCustomerInfo,
  getAllCustomers,
  getSingleCustomer,
} from "../services/customers.js";
import CustomError from "../utils/error/error.js";
export const getAllCustomersController = async (req, res, next) => {
  const { merchant_id, store_id } = req?.user;

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
export const updateCustomerStatus = async (req, res, next) => {
  try {
    const { updates } = req.body;
    const { store_id } = req.user;
    const { customer_id } = req.params;

    const newCustomerData = await EditCustomerInfo({
      updates,
      customer_id,
      store_id,
    });
    res.json({ customer: newCustomerData, status: true });
  } catch (e) {
    next(e);
  }
};

export const DeleteCustomerController = async (req, res, next) => {
  try {
    const { store_id } = req.user;
    const { customer_id } = req.params;

    const newCustomerData = await deleteCustomerFromStore({
      customer_id,
      store_id,
    });
    res.json({ customer: newCustomerData, status: true });
  } catch (e) {
    next(e);
  }
};

export const getSingleCustomerController = async (req, res, next) => {
  //Orders & Customer Details
  try {
    const { customer_id } = req.params;
    const { store_id } = req.user;

    const customer = await getSingleCustomer({ store_id, customer_id });
    console.log(customer);
    console.log(customer_id);
    res.json({ customer, status: true });
  } catch (e) {
    next(e);
  }
};
