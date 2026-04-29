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
export const getSingleCustomerFromDb = async ({ store_id, customer_id }) => {
  try {
    //
    const query_text_customers = ` 
    ------- CUSTOMER Info! ----
    SELECT 
    cs.*, 
    buyer.phone as phone, 
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

    const res = await pool.query(query_text_customers, [store_id, customer_id]);
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

  try {
    const query_text = ` 
   SELECT 
   buyer.phone, cs.*, 
   COUNT(buyer.id) OVER () as total_customers
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
    //console.log(res.rows);
    return {
      customers: res.rows,
      total_customers: res?.rows[0]?.total_customers,
    };
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
  //const { phone, ...UpdateWithOutPhone} = updates;

  const { setClause, values, fields } = ClauseExtractor({ updates });

  const allowedField = ["email", "tag", "blacklisted", "name"];

  const isAllowed = fields.some((field) =>
    allowedField.includes(field.toLowerCase()),
  );

  if (!isAllowed) {
    throw new CustomError("Invalid field!", 400);
  }

  try {
    const para_query = [...values, customer_id, store_id];

    const query_text_customer_store = ` 
    UPDATE customer_store
    SET ${setClause}
    WHERE customer_id = $${para_query.length - 1} AND store_id = $${para_query.length}  
    returning customer_id, name, tag, blacklisted, email;
     `;

    const res = await pool.query(query_text_customer_store, para_query);
    return res.rows[0];
  } catch (e) {
    throw new CustomError(e);
  }
};

export const DeleteCustomerDb = async ({ customer_id, store_id }) => {
  try {
    const query_text = `DELETE FROM customer_store 
    where customer_id = $1 AND store_id = $2
    returning customer_id;
    `;
    const res = await pool.query(query_text, [customer_id, store_id]);
    return { id: res.rows[0]?.customer_id };
  } catch (e) {
    console.log(e);
    throw new CustomError(e);
  }
};
