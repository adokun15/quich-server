import { ClauseExtractor } from "../utils/database/ClauseExtractor.js";
import pool from "../utils/database/db.js";
import CustomError from "../utils/error/error.js";

//Product
export const UpdateProductsToCategoryRepository = async ({
  category_id,
  product_ids,
  store_id,
}) => {
  try {
    const products = await pool.query(
      `
      UPDATE products
      SET category_id = $1
      WHERE id = ANY($2::uuid[]) AND store_id = $3
      RETURNING *;
    `,
      [category_id, product_ids, store_id],
    );
    return { products: products.rows[0] };
  } catch (e) {
    throw new CustomError(e?.message, e?.code);
  }
};

//Direct access to dbs
export const CreateCategoryRepository = async ({
  category_name,
  slug,
  store_id,
}) => {
  try {
    const query_text = ` 
    INSERT INTO category (store_id, name, slug)
    VALUES ($1, $2, $3)
    returning *;
     `;
    const res = await pool.query(query_text, [store_id, category_name, slug]);
    return { category: res.rows[0] };
  } catch (e) {
    throw new CustomError(e);
  }
};

//Transactional:
export const updateCategory = async ({ updates, category_id, store_id }) => {
  const allowedField = ["name", "isvisible"];

  const { fields, setClause, values } = ClauseExtractor({
    updates,
  });

  const isAllowed = fields.some((field) =>
    allowedField.includes(field.toLowerCase()),
  );

  if (!isAllowed) {
    throw new CustomError("Invalid field!", 400);
  }

  const client = await pool.client();
  try {
    await client.query("BEGIN");
    const q = [...values, category_id, store_id];

    const query_text = `
    UPDATE category SET ${setClause} WHERE id = $${q.length - 1} AND store_id = $${q.length} RETURNING *`;

    const res = await client.query(query_text, q);
    await client.query("COMMIT");
    return { category: res.rows[0] };
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    throw new CustomError(e);
  } finally {
    client.release();
  }
};

//Query
export const getCategoriesFromDb = async ({
  store_id,
  category_name = null,
  isvisible = null,
  sortBy = "c.created_at",
  sortOrder = "DESC",
}) => {
  try {
    const res = await pool.query(
      `
      select *
      from category c
      where 
      c.store_id = $1
      AND (
  ($2::TEXT IS NULL OR c.name ILIKE $2 || '%')
)
AND (
  ($3::BOOLEAN IS NULL OR c.isvisible = $3)
)
      --order by created_at or name desc
      order by ${sortBy} ${sortOrder};   
    
       `,
      [store_id, category_name, isvisible],
    );

    return { categories: res.rows };
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

export const getSingleCategory = async ({ store_id, category_id }) => {
  try {
    const res = await pool.query(
      `
      select 
       c.*,
       ---read more on page 46 and for COALESCE read on conditional function
      COALESCE(jsonb_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') 
      AS productlist
      from category c left join products p 
      on c.id = p.category_id
      where c.store_id = $1 AND c.id = $2
      GROUP BY c.id
      `,
      [store_id, category_id],
    );

    return { category: res.rows[0] };
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

export const DeleteCategory = async ({ category_id, store_id }) => {
  try {
    const res = await pool.query(
      `
        DELETE FROM category 
        WHERE id = $1 AND store_id = $2
        RETURNING *;
  `,

      [category_id, store_id],
    );

    return { deleted_category: res.rows[0] };
  } catch (e) {
    throw new CustomError(e?.message);
  }
};
