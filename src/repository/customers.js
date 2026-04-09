import { ClauseExtractor } from "../utils/database/ClauseExtractor.js";
import pool from "../utils/database/db.js";
import CustomError from "../utils/error/error.js";

export const CreateCustomerforDb = async ({ phone, store_id, name = null }) => {
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
        
      INSERT INTO customer_store (customer_id, store_id, name)
        SELECT id, $2, $3 FROM inserted_customer
      ON CONFLICT (customer_id, store_id) 
      DO UPDATE SET  
        name = EXCLUDED.name 
      RETURNING *;
      `;

    const res = await pool.query(query_text, [phone, store_id, name]);
    console.log("From Cusgtomer Table", res.rows[0]);
    return res.rows[0];
  } catch (e) {
    console.log("from customer", e);
    console.log("from customer", e?.code);
    /*
    42703: ROW HAS NO FIELD: 'field_name'
    */
    throw new CustomError(e);
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
    throw new CustomError(e);
  }
};

export const getCustomersFromDb = async ({
  storeId,
  search,
  sortBy = "cs.created_at",
  order = "DESC",
  offset = 0,
  limit = 30,
}) => {
  const allowedSort = ["cs.created_at", "cs.name"];
  const allowedOrder = ["ASC", "DESC"];

  if (!allowedOrder.includes(order)) {
    throw new CustomError("Invalid Order");
  }

  if (!allowedSort.includes(sortBy)) {
    throw new CustomError("Invalid Sort Field");
  }

  console.log(storeId);
  try {
    const query_text = ` 
   SELECT 
   buyer.phone, cs.* 
   from customer_store cs
   left join customers buyer 
   on cs.customer_id = buyer.id
   where cs.store_id = $1
   AND (
   cs.email ILIKE $2 || '%' 
   OR 
   cs.name ILIKE $2 || '%' 
   OR
   cs.tag ILIKE $2 || '%'
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
    console.log(res.rows);
    return res.rows;
  } catch (e) {
    console.log(e);
    throw new CustomError(e);
  }
};

export const UpdateCustomerFromDb = async ({
  updates,
  customer_id,
  store_id,
}) => {
  const { setClause, values } = ClauseExtractor({ updates });

  const allowedField = ["email", "tag", "blacklisted", "name"];
  if (!allowedField.includes(field.toLowerCase())) {
    throw Error("Invalid field!");
  }

  try {
    const para_query = [...values, customer_id, store_id];
    const query_text = ` 
    UPDATE customer_store
    SET ${setClause}
    WHERE customer_id = $${values.length - 1} AND store_id = $${values.length}  
    returning *;
     `;

    const res = await pool.query(query_text, para_query);
    return res.rows[0];
  } catch (e) {
    throw new CustomError(e);
  }
};

export const DeleteCustomerDb = async ({ customer_id, store_id }) => {
  try {
    const query_text = ` DELETE FROM customer_store 
    where customer_id = $1 AND store_id = $2
    returning *;
    `;
    const res = await pool.query(query_text, [customer_id, store_id]);
    return res.rows[0];
  } catch (e) {
    throw new CustomError(e);
  }
};
