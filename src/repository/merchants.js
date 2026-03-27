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
    throw CustomError(e);
  }
};

export const UpdateMerchantFromDb = async ({ field, query }) => {
  const allowedField = ["email", "name", "phone"];

  if (!allowedField.includes(field.toLowerCase())) {
    throw Error("Invalid field!");
  }

  try {
    const query_text = `      
    UPDATE merchants
    SET ${field} = $1
    WHERE id = $2 
    returning *;
    `;
    const res = await pool.query(query_text, query);
    return res.rows[0];
  } catch (e) {
    throw CustomError(e);
  }
};

export const getMerchantFromDb = async (query) => {
  try {
    const query_text = `     
    select * from merchants 
    where phone = $1 OR merchant_id = $1 OR email = $1        
    `;
    const res = await pool.query(query_text, query);

    if (!res.rows.length === 0) {
      throw CustomError("Merchant not Found", 404);
    }

    return res.rows[0];
  } catch (e) {
    throw CustomError(e);
  }
};

export const DeleteMerchantFromDb = async (id) => {
  try {
    const query_text = `DELETE FROM merchants WHERE id = $1`;
    const res = await pool.query(query_text, [id]);
    return res.rows[0];
  } catch (e) {
    throw CustomError(e);
  }
};
