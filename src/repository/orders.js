export const CreateOrderforDb = async () => {
  try {
    //
    const query_text = ` 
    INSERT INTO orders (merchant_id, customer_id, total_amount, cart_items)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
    `;

    const res = await pool.query(query_text, query);
    return res;
  } catch (e) {
    console.log(e);
    throw CustomError(e);
  }
};

export const getOrdersFromDb = async (query) => {
  try {
    //By MERCHANT ID OR BY CUSTOMER ID
    const query_text = ` 
    --cs.created_at AS member_since
    SELECT      
    o.id AS order_id,
    o.total_amount,
    --sum(o.total_amount) AS total_order_amount,
    --len(r) AS total_orders_made,
    o.status,
    o.created_at AS order_creation,
    c.phone AS customer_phone,
    cs.name AS customer_name,
    cs.tag AS customer_tag,
    FROM orders o 
    LEFT JOIN customer_store cs
    on cs.customer_id = o.customer_id
    LEFT JOIN customer c
    on  c.id = o.customer_id
    --Merchant orders or Customers Order
    WHERE merchant_id = $1 OR customer_id = $1
    where o.id ILIKE $2 || "%" 
    OR cs.name ILIKE $2 || "%"
    OR c.phone ILIKE $2 || "%"
    OR o.status = $3
    -- CREATED_AT | AMOUNT
    order by $4 desc
    offset $5
    limit $6
     `;
    const res = await pool.query(query_text, query);
    return res;
  } catch (e) {
    console.log(e);
    throw CustomError(e);
  }
};

export const getOrderDetailsFromDb = async (query) => {
  try {
    //By MERCHANT ID OR BY CUSTOMER ID
    const query_text = ` 
    SELECT 
      o.*,
      c.id AS customer_id,
      c.phone AS customer_phone,
      cs.name AS customer_name,
      cs.tag AS customer_tag,
      cs.created_at AS member_since,
    FROM orders
    LEFT JOIN customer_store cs
    on cs.customer_id = o.customer_id
    LEFT JOIN customer c
    on  c.id = o.customer_id
    WHERE id = $1 
    `;
    const res = await pool.query(query_text, query);
    return res;
  } catch (e) {
    console.log(e);
    throw CustomError(e);
  }
};

export const UpdateOrderForDb = async (query) => {
  //Add Address
  const allowedField = ["note", "address", "status"];

  if (!allowedField.includes(field.toLowerCase())) {
    throw Error("Invalid field!");
  }

  try {
    const query_text = ` UPDATE orders
    SET ${field} = $1;
    WHERE id = $2 AND merchant_id = $3
    returning *;
    `;
    const res = await pool.query(query_text, query);
    return res;
  } catch (e) {
    throw CustomError(e);
  }
};

export const DeleteOrderFromDb = async (query) => {
  try {
    const query_text = ` DELETE FROM orders where merchant_id = $2 AND id = $1`;
    const res = await pool.query(query_text, query);
    return res;
  } catch (e) {
    throw CustomError(e);
  }
};
