export const CreateMerchantforDb = async (query) => {
  await pool.query(`
  INSERT INTO merchants(phone, name, email)
  VALUES ($1, $2, $3)
  returning *;
`);
};

export const UpdateMerchantFromDb = async (query) => {
  await pool.query(`
    UPDATE merchants SET $1 = $2 where id = $3;
    returning *;
    `);
};

export const getMerchantFromDb = async (query) => {
  await pool.query(
    `
        select *
        from merchants 
        where phone = $1 OR merchant_id = $1 OR email = $1        
        `,
    query,
  );
};

export const DeleteMerchantFromDb = async (query) => {
  await pool.query(`
     DELETE FROM merchants WHERE id = $1
  `);
};
