//Clients!
import pool from "../utils/database/db";

export const CreateMerchantStore = async (query) => {
  try {
    const res = await pool.query(
      `
      INSERT INTO stores(merchant_id, category, name, slug, bio, logo)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
       `,
      query,
    );

    return { store: res?.rows[0] };
  } catch (e) {
    console.log(e);
    throw CustomError(e);
  }
};

export const GetMerchantStoreDetail = async (query) => {
  try {
    const res = await pool.query(
      `
      select s.*,
      to_jsonb(m) AS merchant
      from stores s
      left join merchants m
        on s.merchant_id = m.id
        where s.slug = $1 OR s.id::TEXT = $1
      `,
      query,
    );

    return { store: res?.rows[0] };
  } catch (e) {
    console.log(e);
    throw CustomError(e);
  }
};

export const UpdateMerchantStore = async (query) => {
  const allowedField = [
    "category",
    "slug",
    "bio",
    "name",
    "logo",
    "address",
    "video_profile",
  ];

  if (!allowedField.includes(field.toLowerCase())) {
    throw Error("Invalid field!");
  }

  //const client = await pool.connect();

  try {
    //await client.query("BEGIN");

    const query_text = `      
    UPDATE stores
    SET ${field} = $1
    WHERE id = $2 
    returning *;
    `;

    const res = await pool.query(query_text, query);

    //await client.query("COMMIT");

    return { store: res.rows[0] };
  } catch (e) {
    //await client.query("ROLLBACK");
    console.log(e);
    throw CustomError(e);
  }
  //client.release();
};

//Transaction;
export const DeleteMerchantStore = async (query) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const query_text = `      
    DELETE FROM stores
    WHERE id = $1  OR slug = $1 
    returning *;
    `;

    const res = await client.query(query_text, query);

    await client.query("COMMIT");
    return { deleted_store: res.rows[0] };
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    throw CustomError(e);
  } finally {
    client.release();
  }
};
