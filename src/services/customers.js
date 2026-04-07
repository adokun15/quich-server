//import CustomError from "../../utils/error.js";

import {
  CreateCustomerforDb,
  DeleteCustomerDb,
  getCustomersFromDb,
  getSingleCustomerFromDb,
  UpdateCustomerFromDb,
} from "../repository/customers";
import CustomError from "../utils/error/error";

//Customer business Logic

//Create Customer: only when an order is made;
export async function CreateCustomerForStore({
  phone,
  merchant_id,
  store_id,
  name,
}) {
  try {
    const customer = await CreateCustomerforDb({
      phone,
      merchant_id,
      store_id,
      name,
    });
    return customer;
  } catch (e) {
    throw new CustomError(e?.mssage);
  }
}

//getMultipleUsers;
export async function getAllCustomers({ store_id, filter }) {
  try {
    const customers = await getCustomersFromDb({ ...filter, store_id });
    return customers;
  } catch (e) {
    throw new CustomError(e?.mssage);
  }
}

//Get Single Customer with Last 10 orders
export async function getSingleCustomer({ customer_id, store_id }) {
  try {
    const customer = await getSingleCustomerFromDb({ customer_id, store_id });
    return customer;
  } catch (e) {
    throw new CustomError(e?.mssage);
  }
}

//Add to Blacklist / Remove from blacklist Customer
export async function EditCustomerInfo({ updates, customer_id, store_id }) {
  try {
    const customer = await UpdateCustomerFromDb({
      updates,
      customer_id,
      store_id,
    });
    return customer;
  } catch (e) {
    throw new CustomError(e?.mssage);
  }
}

//Delete Customer: Manual deletion | Tho it is deleted when store is deleted;
export async function deleteCustomerFromStore({ customer_id, store_id }) {
  //Delete Only customer FROM your Store
  try {
    const customer = await DeleteCustomerDb({ customer_id, store_id });
    return customer;
  } catch (e) {
    throw new CustomError(e?.mssage);
  }
}
