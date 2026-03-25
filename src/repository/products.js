//Direct access to dbs
export const CreateProduct = async (query) => {
  await pool.query(`
  INSERT INTO products (merchant_id, name, price, quantity, description, images)
  VALUES ($1, $2, $3, $4, $5, $6);
  `);
};

export const updateProduct = async (query) => {
  await pool.query(
    `
   UPDATE products SET $1 = $2 where id = $3;
  `,
    query,
  );
};

//Query
export const getProducts = async (query) => {
  await pool.query(`
   select p.*,
   c.name as category_name,
   c.isVisible as category_visibility
   sum(price) as total_price_amount, 
   from products p 
   left join 
   category c 
   on p.category_id = c.id
   where p.merchant_id = $1
   where c.name ILIKE $2 || "%"
--order by p.created_at or price desc
   order by $3 $4
   offset $5
 --limit 30 || 50 || 100
   limit $6
  `);

  //Paginate result in 20;
  //Order by date, price
  //Filter by category,
};
export const getSingleProduct = async (query) => {
  await pool.query(`
   select p.*, to_jsonb(c.*) as category_info 
   from products p left join category c 
   on p.category_id = c.id
   where p.merchant_id = $1 AND p.id = $2
   `);
};

export const DeleteProduct = async (query) => {
  await pool.query(`
  DELETE FROM products WHERE id = $1
    `);
};
