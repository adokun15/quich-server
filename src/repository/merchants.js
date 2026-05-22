import { ClauseExtractor } from "../utils/database/ClauseExtractor.js";
import pool from "../utils/database/db.js";
import DatabaseError from "../utils/error/DatabaseError.js";
import CustomError from "../utils/error/error.js";

export const CreateMerchantforDb = async (query) => {
  try {
    const query_text = ` 
  INSERT INTO merchants(phone, name, email)
  VALUES ($1, $2, $3)
  returning *;
    `;

    const res = await pool.query(query_text, query);
    return res.rows[0];
  } catch (e) {
    console.log(e);
    throw new CustomError(e?.message);
  }
};

export const UpdateMerchantFromDb = async ({ updates, merchant_id }) => {
  const { id, setClause, values } = ClauseExtractor({
    updates,
    id: merchant_id,
  });

  const allowedField = ["id", "email", "name", "phone"];

  const isAllowed = fields.some((field) =>
    allowedField.includes(field.toLowerCase()),
  );

  if (!isAllowed) {
    throw new CustomError("Invalid field!", 400);
  }

  try {
    const query_text = `      
    UPDATE merchants
    SET ${setClause}
    WHERE id = $${id} 
    returning *;
    `;
    const res = await pool.query(query_text, values);
    return res.rows[0];
  } catch (e) {
    throw new CustomError(e);
  }
};

export const getMerchantFromDb = async (identifier) => {
  try {
    let query_text = ``;

    if (typeof identifier === "string" && identifier.includes("@")) {
      query_text = `     
    select * from merchants 
    where email = $1;        
    `;
    } else if (
      (!isNaN(identifier) && identifier.length === 10) ||
      typeof identifier === "number"
    ) {
      query_text = `     
     select * from merchants 
     where phone = $1;        
     `;
    } else {
      query_text = `     
     select * from merchants 
     where id = $1;        
     `;
    }
    const res = await pool.query(query_text, [identifier]);

    if (!res.rows.length === 0) {
      throw new CustomError("Merchant not Found", 404);
    }

    return res.rows[0];
  } catch (e) {
    console.log(e);
    throw new CustomError(e?.message);
  }
};

//After 1 year & automatically delete
export const DeleteMerchantFromDb = async (id) => {
  const pquery = await pool.connect();

  try {
    await pquery.query("BEGIN");

    //sET TO FALSE TO PREVENT USER FROM CREATING A FREE TRIAL ACCOUNT ONCE FREE TRAIL IS REMOVED THEN WE CAN DELETE MERCHANT
    const query_text_merchant = `UPDATE SET active = false WHERE merchants $1 RETURNING *`;
    const query_text_store = `DELETE FROM stores WHERE merchant_id = $1`;

    const res_merchant = await pool.query(query_text_merchant, [id]);
    await pool.query(query_text_store, [id]);

    await pquery.query("COMMIT");
    return res_merchant.rows[0];
  } catch (e) {
    await pquery.query("ROLLBACK");
    throw DatabaseError(e);
  }
};
