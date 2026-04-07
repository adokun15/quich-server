import { ClauseExtractor } from "../utils/database/ClauseExtractor.js";
import pool from "../utils/database/db.js";
import CustomError from "../utils/error/error.js";

//Direct access to dbs
export const CreateProduct = async ({
  store_id,
  price,
  name,
  quantity,
  desc,
}) => {
  try {
    const res = await pool.query(
      `
    INSERT INTO products 
    (store_id, name, price, quantity, description)
    VALUES ($1, $2, $3, $4, $5,)
    RETURNING *;
    `,
      [store_id, name, price, quantity, desc],
    );
    return { product: res.rows[0] };
  } catch (e) {
    throw new CustomError(e);
  }
};

/*
All Update must be like this to be dynamic and also add a whitelist for incoming fields
*/

//updates: { name: "product_an", some_field: "field_ name"}
export const updateProduct = async ({ product_id, updates, store_id }) => {
  const { setClause, values } = ClauseExtractor({ updates });
  const q = [...values, product_id, store_id];
  try {
    const res = await pool.query(
      `
        UPDATE products SET ${setClause} where id = $${q.length - 1} AND store_id = $${q.length} 
        RETURNING *;
        `,
      q,
    );
    return res.rows[0];
  } catch (e) {
    throw new CustomError(e);
  }
};

//Query

export const getProducts = async ({
  store_id,
  search = "",
  OrderBy = "p.created_at", //p.price
  direction = "DESC",
  offset = 0,
  limit = 20, //Default For Store Fetches only;
}) => {
  try {
    const res = await pool.query(
      `
    select p.*,
    c.name as category_name,
    c.isVisible as category_visibility
    from products p 
    left join category c 
    on p.category_id = c.id
    where p.store_id = $1 
    AND (c.name ILIKE $2 || "%" OR p.name ILIKE $2 || "%")
    order by ${OrderBy} ${direction}
    offset $3
    limit $4
    `,
      [store_id, `${search}%`, offset, limit],
    );
    return { products: res.rows };
  } catch (e) {
    throw new CustomError(e);
  }
};

export const getSingleProduct = async ({ store_id, product_id }) => {
  try {
    const res = await pool.query(
      `
  select p.*, to_jsonb(c) as category_info 
   from products p left join category c 
   on p.category_id = c.id
   where p.merchant_id = $1 AND p.id = $2
     `,
      [store_id, product_id],
    );
    return { product: res.rows[0] };
  } catch (e) {
    throw new CustomError(e);
  }
};

export const DeleteProduct = async ({ product_id, store_id }) => {
  try {
    const res = await pool.query(
      `
      DELETE FROM products WHERE id = $1 AND merchant_id = $2
      RETURNING *
     `,
      [product_id, store_id],
    );
    return { deleted_product: res.rows[0] };
  } catch (e) {
    throw new CustomError(e);
  }
};
