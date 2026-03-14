import pool from "../utils/database/db";

export const CreateMerchantStore = () => {};

export const GetMerchantStoreDetail = async (query) => {
  try {
    const res = await pool.query(
      "SELECT * from customers Where customer_id = $1",
      query,
    );

    console.log(res);
    return { time_of_request: res?.rows };
  } catch (e) {
    console.log(e);
    throw CustomError(e);
  }
};

export const UpdateMerchantStore = (order_id) => {};

export const DeleteMerchantStore = (order_id) => {};
