import pool from "../utils/database/db.js";
import CustomError from "../utils/error/error.js";

export const CreateCustomerforDb = async (query) => {
  try {
    //
    const query_text = ` 
      WITH inserted_customer as (
        INSERT INTO customers (phone) 
        VALUES ($1)
        ON CONFLICT (phone)
        DO UPDATE SET phone = EXCLUDED.phone
        RETURNING id
      ) 
        
      INSERT INTO customer_store (customer_id, store_id, merchant_id, name)
        SELECT id, $2, $3, $4 FROM inserted_customer
      ON CONFLICT (customer_id, store_id) DO NOTHING
      RETURNING *;
      `;

    const res = await pool.query(query_text, query);
    return res.rows[0];
  } catch (e) {
    console.log(e);
    throw CustomError(e);
  }
};

//Incomplete: add Orders Table
export const getSingleCustomerFromDb = async ({ storeId, customerId }) => {
  try {
    //
    const query_text_customers = ` 
    ------- CUSTOMER Info! ----
    SELECT 
    cs.*, 
    buyer.phone as phone 
    (
      SELECT COALESCE(jsonb_agg(o.*), '[]')
      FROM (
        SELECT * FROM orders
        where customer_id = cs.customer_id
        ORDER BY created_at DESC
        LIMIT 10 
      ) o
    ) AS orders
    FROM customer_store cs
    JOIN customers buyer
    on  cs.customer_id = buyer.id 
    where cs.store_id = $1 AND cs.customer_id = $2
    `;

    const res = await pool.query(query_text_customers, [storeId, customerId]);
    return res.rows[0];
  } catch (e) {
    console.log(e);
    throw CustomError(e);
  }
};

export const getCustomersFromDb = async ({
  storeId,
  search,
  sortBy = "created_at",
  order = "DESC",
  offset = 0,
  limit = 30,
}) => {
  const allowedSort = ["created_at", "name"];
  const allowedOrder = ["ASC", "DESC"];

  if (!allowedOrder.includes(order)) {
    throw new CustomError("Invalid Order");
  }

  if (!allowedSort.includes(sortBy)) {
    throw new CustomError("Invalid Sort Field");
  }

  try {
    const query_text = ` 
   SELECT buyer.phone, cs.* 
   from customer_store cs
   left join customers buyer 
   on cs.customer_id = buyer.id
   where cs.store_id = $1
   AND (
   cs.email ILIKE $2 || "%" 
   OR 
   cs.name ILIKE $2 || "%" 
   OR
   cs.tag ILIKE $2 || "%"
  ) 
   order by ${sortBy} ${order}
   offset $3
   limit $4 `;
    const res = await pool.query(query_text, [
      storeId,
      search || "",
      offset,
      limit,
    ]);
    return res.rows;
  } catch (e) {
    throw CustomError(e);
  }
};

export const UpdateCustomerFromDb = async ({ field, query }) => {
  const allowedField = ["email", "tag", "blacklisted", "name"];
  if (!allowedField.includes(field.toLowerCase())) {
    throw Error("Invalid field!");
  }

  try {
    //
    const query_text = ` 
    UPDATE customer_store
    SET ${field} = $1;
    WHERE merchant_id = $2 AND customer_id = $3 AND store_id = $4  
    returning *;
     `;
    const res = await pool.query(query_text, query);
    return res.rows[0];
  } catch (e) {
    throw CustomError(e);
  }
};
export const DeleteCustomerFromStore = async (query) => {
  try {
    const query_text = ` DELETE FROM customer_store 
    where merchant_id = $1 AND customer_id = $2 AND store_id = $3`;
    const res = await pool.query(query_text, query);
    return res.rows[0];
  } catch (e) {
    throw CustomError(e);
  }
};
