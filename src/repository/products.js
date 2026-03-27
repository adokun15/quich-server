import pool from "../utils/database/db";
import CustomError from "../utils/error/error";

//Direct access to dbs
export const CreateProduct = async (query) => {
  try {
    const res = await pool.query(
      `
    INSERT INTO products 
    (merchant_id, name, price, quantity, description, images)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `,
      query,
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
export const updateProduct = async ({ id, updates }) => {
  //Just the ["key = $1", "key =  $2"]
  const setClause = Object.keys(updates)
    .map((key, i) => `"${key}" = $${i + 1}`)
    .join(", ");

  //Just the [value1, value2]
  const values = Object.values(updates);

  //Just the [value1, value2, id]
  //Add Id As the Last value
  values.push(id);
  try {
    const res = await pool.query(
      `
        UPDATE products SET ${setClause} where id = ${values.length};
        `,
      values,
    );
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

export const getSingleProduct = async (query) => {
  try {
    const res = await pool.query(
      `
  select p.*, to_jsonb(c) as category_info 
   from products p left join category c 
   on p.category_id = c.id
   where p.merchant_id = $1 AND p.id = $2
     `,
      [store_id, `${search}%`, offset, limit],
    );
    return { product: res.rows[0] };
  } catch (e) {
    throw new CustomError(e);
  }
};

export const DeleteProduct = async (query) => {
  try {
    const res = await pool.query(
      `
      DELETE FROM products WHERE id = $1 AND merchant_id = $2
      RETURNING *
     `,
      query,
    );
    return { deleted_product: res.rows[0] };
  } catch (e) {
    throw new CustomError(e);
  }
};
