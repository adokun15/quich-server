import { ClauseExtractor } from "../utils/database/ClauseExtractor.js";
import pool from "../utils/database/db.js";
import CustomError from "../utils/error/error.js";

/*
Create Order
Update Customer : TOTAL ORDER,  

*/
export const CreateOrderRepository = async ({
  customer_id,
  total_amount,
  cart_items,
  store_id,
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    //Create Order
    const orderRes = await client.query(
      ` 
      INSERT INTO orders (store_id,
      customer_id, total_amount, cart_items)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
      `,
      [store_id, customer_id, total_amount, cart_items],
    );

    const orderId = orderRes.rows[0].id;

    //Update customer stats (per store)
    const customer = await client.query(
      ` 
        INSERT INTO customer_store (
        customer_id, 
        store_id,
        total_orders, 
        total_orders_amount
        )
        -- Create store customer if user is new
        VALUES ($1, $2, 1, $3)
        -- update store customer if user already exist
        ON CONFLICT(customer_id, store_id)
        -- then update data if it already exist
        DO UPDATE SET 
          total_orders = customer_store.total_orders + 1,
          total_orders_amount = customer_store.total_orders_amount + EXCLUDED.total_orders_amount
        RETURNING *;
        `,
      [customer_id, store_id, total_amount],
    );

    await client.query("COMMIT");

    return { orderId, customer: customer.rows[0] };
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    throw new CustomError(e);
  } finally {
    client.release();
  }
};

export const getOrdersFromDb = async ({
  store_id,
  search = "",
  customer_id = null,
  order_status = null,
  offset = 0,
  limit = 30, //Default For Store Fetches only;
  sortField, //
  sortOrder,
}) => {
  const allowedSort = {
    created_at: "o.created_at",
    total_amount: "o.total_amount",
  };

  const sortBy = allowedSort[sortField] || "o.created_at";
  const orderby = sortOrder === "asc" ? "ASC" : "DESC";

  try {
    //By Store ID OR BY CUSTOMER ID
    const query_text = ` 
    --cs.created_at AS member_since
    SELECT      
    o.id AS order_id,
    COUNT(o.id) OVER () AS total_orders,
    o.total_amount,
    o.status,
    o.created_at AS order_creation,
    c.phone AS customer_phone,
    cs.name AS customer_name,
    cs.tag AS customer_tag
    FROM orders o 
    LEFT JOIN customer_store cs
    on cs.customer_id = o.customer_id
    LEFT JOIN customers c
    on  c.id = o.customer_id
    --Merchant orders or Customers Order
    WHERE 
    (o.store_id = $1 OR (cs.customer_id = $6 AND cs.store_id = $1))
    AND (
    o.id::TEXT ILIKE $2 || '%' 
    OR cs.name ILIKE $2 || '%'
    OR c.phone ILIKE $2 || '%'
    OR o.status = $3
  )
   
  -- CREATED_AT | AMOUNT
    order by ${sortBy} ${orderby}
    offset $4
    limit $5
     `;
    const res = await pool.query(query_text, [
      store_id,
      search,
      order_status,
      offset,
      limit,
      customer_id, //If null leave
    ]);
    return { orders: res.rows, total_amount: res.rows[0]?.total_orders };
  } catch (e) {
    console.log(e);
    throw new CustomError(e);
  }
};

export const getOrderDetailsFromDb = async ({ store_id, order_id }) => {
  try {
    //By store ID OR BY CUSTOMER ID
    const query_text = ` 
    SELECT 
      o.*,
      c.id AS customer_id,
      c.phone AS customer_phone,
      cs.name AS customer_name,
      cs.tag AS customer_tag,
      cs.created_at AS member_since
    FROM orders o
    LEFT JOIN customer_store cs
    on cs.customer_id = o.customer_id
    LEFT JOIN customers c
    on  c.id = o.customer_id
    WHERE o.id = $1 AND o.store_id = $2
    `;
    const res = await pool.query(query_text, [order_id, store_id]);
    return res.rows[0];
  } catch (e) {
    console.log(e);
    throw new CustomError(e);
  }
};

export const UpdateOrderForDb = async ({ updates, store_id, order_id }) => {
  const { setClause, values, fields } = ClauseExtractor({
    updates,
  });

  //Add Address
  const allowedField = ["note", "address", "status"];

  const isAllowed = fields.some((field) =>
    allowedField.includes(field.toLowerCase()),
  );

  if (!isAllowed) {
    throw new CustomError("Invalid field!", 400);
  }

  try {
    const para_query = [...values, order_id, store_id];
    const query_text = ` 
    UPDATE orders
    SET ${setClause}
    WHERE id = $${values.length - 1} AND store_id = $${values.length}  
    returning id, status, note, address;
    `;
    const res = await pool.query(query_text, para_query);
    return res.rows[0];
  } catch (e) {
    throw new CustomError(e);
  }
};

export const DeleteOrderFromDb = async ({ store_id, order_id }) => {
  try {
    const query_text = ` DELETE FROM orders where store_id = $2 AND id = $1 returning id;`;
    const res = await pool.query(query_text, [order_id, store_id]);
    return res.rows[0];
  } catch (e) {
    throw new CustomError(e);
  }
};
