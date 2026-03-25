//Direct access to dbs
export const CreateCategory = async (query) => {
  await pool.query(`
  INSERT INTO products (merchant_id, name)
  VALUES ($1, $2)
  returning *;
  `);
};

export const updateCategory = async (query) => {
  await pool.query(
    `
        UPDATE category SET $1 = $2 where id = $3;
        returning *;
   `,
    query,
  );
};

//Query
export const getCategoriesFromDb = async (query) => {
  await pool.query(`
   select *
   from category  
   where merchant_id = $1
   where name ILIKE $2 || "%" OR invisible = $3
   --order by created_at or name desc
   order by $4 $5   
  `);
};

export const getSingleCategory = async (query) => {
  await pool.query(`
   select c.*, to_jsonb(p.*) as productlist
   from category c left join products p 
   on c.id = p.category_id
   where c.merchant_id = $1 AND c.id = $2
   `);
};

export const DeleteCategory = async (query) => {
  await pool.query(`
  DELETE FROM category WHERE id = $1
    `);
};
