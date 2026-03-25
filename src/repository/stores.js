//Clients!
import pool from "../utils/database/db";

export const CreateMerchantStore = async () => {
  try {
    const res = await pool.query(
      `
      INSERT INTO store(merchant_id, category, name, slug, bio, logo)
      VALUES ($1, $2, $3, $4, $5, $6)
       `,
      query,
    );

    return { time_of_request: res?.rows[0] };
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
        to_jsonb(m.*) as merchant
        from stores s
        left join merchants m
        on s.merchant_id = m.id
        where s.slug = $1 OR s.id = $1
      `,
      query,
    );

    return { time_of_request: res?.rows[0] };
  } catch (e) {
    console.log(e);
    throw CustomError(e);
  }
};

//Transaction;
export const UpdateMerchantStore = async (query) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const query_text = `
        select s.*,
        to_jsonb(m.*) as merchant
        from stores s
        left join merchants m
        on s.merchant_id = m.id
        where s.slug = $1 OR s.id = $1
        returning *
      `;

    //Run multiples queries
    const res = await client.query(query_text, query);

    await client.query("COMMIT");

    return res;
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    throw CustomError(e);
  } finally {
    client.release();
  }
};

//Transaction;
export const DeleteMerchantStore = async (query) => {};
