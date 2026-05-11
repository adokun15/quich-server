//Clients!
import { ClauseExtractor } from "../utils/database/ClauseExtractor.js";
import pool from "../utils/database/db.js";
import CustomError from "../utils/error/error.js";

export const CreateMerchantStoreDB = async (query) => {
  try {
    const res = await pool.query(
      `
      INSERT INTO stores(merchant_id, category, name, slug)
      VALUES ($1, $2, $3, )
      RETURNING *;
       `,
      query,
    );

    return { store: res?.rows[0] };
  } catch (e) {
    console.log(e);
    throw new CustomError(e);
  }
};

export const GetMerchantStoreDetail = async (query) => {
  const res = await pool.query(
    `
      select s.*,
      to_jsonb(m) AS merchant
      from stores s
      left join merchants m
        on s.merchant_id = m.id
        where s.slug = $1 OR s.id::TEXT = $1
      `,
    [query],
  );

  if (res?.rows?.length === 0) {
    throw new CustomError("Store not Found. Check Slug", 404);
  }

  return { store: res?.rows[0] };
};

export const UpdateMerchantStoreDB = async ({
  updates,
  store_id,
  merchant_id,
}) => {
  const allowedField = [
    "category",
    "slug",
    "bio",
    "name",
    "logo",
    "address",
    "video_profile",
  ];
  const { id, setClause, values, fields } = ClauseExtractor({
    updates,
    id: store_id,
  });

  const isNotAllowed = fields.some(
    (field) => !allowedField.includes(field.toLowerCase()),
  );

  if (isNotAllowed) {
    throw new CustomError("Invalid field!", 400);
  }

  try {
    const query_text = `      
    UPDATE stores
    SET ${setClause}
    WHERE id = $${id} 
    returning id;
    `;

    const res = await pool.query(query_text, values);

    return res.rows[0];
  } catch (e) {
    console.log(e);
    if (e?.code === "22P02") {
      //sTATUS VALUE IS NOT AMONG ENUMS
      throw new CustomError("Invalid value inserted!", e?.status);
    }
    if (e?.code === "23514" && e?.constraint === "store_slug_check") {
      throw new CustomError("Invalid slug value!", 400);
    }
    throw new CustomError("Something went wrong", e?.status);
  }
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
    throw new CustomError(e);
  } finally {
    client.release();
  }
};
