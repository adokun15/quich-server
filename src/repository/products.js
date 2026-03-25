/* Sql To Db; */

//Direct access to dbs
export const CreateProduct = async () => {
  await pool.query(`
  
    `);
  /*
    Create
    product: {}

    categories: {}

    product_categories: {}

    */
};

//Query
export const getProducts = (query) => {
  //Paginate result in 20;
  //Order by date, price
  //Filter by category,
};

export const getOrderDetailsFromDb = (order_id) => {};

export const UpdateOrderForDb = (order_id) => {
  //Add Address
};

export const DeleteOrderFromDb = (order_id) => {};
