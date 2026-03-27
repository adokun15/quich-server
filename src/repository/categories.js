import pool from "../utils/database/db";
import CustomError from "../utils/error/error";

//Direct access to dbs
export const CreateCategory = async (query) => {
  try {
    const query_text = ` 
   INSERT INTO category (merchant_id, name)
    VALUES ($1, $2)
    returning *;
     `;

    const res = await pool.query(query_text, query);
    return { category: res.rows[0] };
  } catch (e) {
    console.log(e);
    throw CustomError(e);
  }
};

//Transactional:
export const updateCategory = async ({ field, query }) => {
  const allowedField = ["name", "isVisible"];

  if (!allowedField.includes(field.toLowerCase())) {
    throw Error("Invalid field!");
  }
  const client = await pool.client();
  try {
    await client.query("BEGIN");

    const query_text = `
    UPDATE category SET ${field} = $1 WHERE id = $2 AND merchant_id = $3`;

    const res = await client.query(query_text, query);
    await client.query("COMMIT");
    return { category: res.rows[0] };
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    throw CustomError(e);
  } finally {
    client.release();
  }
};

//Query
export const getCategoriesFromDb = async ({
  merchant_id,
  category_name,
  invisible,
  OrderBy = "created_at",
  direction = "DESC",
}) => {
  try {
    const res = await pool.query(
      `
      select *
      from category  
      where merchant_id = $1
      AND (name ILIKE $2 OR invisible = $3)
      --order by created_at or name desc
      order by ${OrderBy} ${direction}   
      `,
      [merchant_id, `${category_name}%`, invisible],
    );

    return { categories: res.rows };
  } catch (e) {
    console.log(e);
    throw new CustomError(e?.message);
  }
};

export const getSingleCategory = async (query) => {
  /**
   [{
    id: "id", invisible: '', name: 'name', productlist: []  
}]
   */
  try {
    const res = await pool.query(`
      select 
       c.*,
       ---read more on page 46 and for COALESCE read on conditional function
      COALESCE(jsonb_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') 
      AS productlist
      from category c left join products p 
      on c.id = p.category_id
      where c.merchant_id = $1 AND c.id = $2
      GROUP BY c.id
      `);

    return { category: res.rows };
  } catch (e) {
    console.log(e);
    throw new CustomError(e?.message);
  }
};

export const DeleteCategory = async (query) => {
  try {
    const res = await pool.query(
      `
        DELETE FROM category 
        WHERE id = $1 AND merchant_id = $2
        RETURNING *;
  `,

      query,
    );

    return { deleted_category: res.rows[0] };
  } catch (e) {
    console.log(e);
    throw new CustomError(e?.message);
  }
};
