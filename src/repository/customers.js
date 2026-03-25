import pool from "../utils/database/db";

export const CreateCustomerforDb = async (query) => {
  try {
    //
    const query_text = ` 
      WITH inserted_customer as (
        INSERT INTO customers (phone) 
        VALUES ($1)
        ON CONFLICT (phone)
        DO UPDATE SET phone = EXCLUDED.Phone
        RETURNING id
      ) 
        
      INSERT INTO customer_store (customer_id, store_id, merchant_id, name)
        SELECT id, $2, $3, $4 FROM inserted_customer
      ON CONFLICT (customer_id, store_id) DO NOTHING;
    `;

    const res = await pool.query(query_text, query);
    return res;
  } catch (e) {
    console.log(e);
    throw CustomError(e);
  }
};

//Incomplete: add Orders Table
export const getSingleCustomerFromDb = async (query) => {
  try {
    //
    const query_text_customers = ` 
    SELECT cs.*, 
    buyer.phone as phone 
    FROM customers buyer
    left join customer_store cs
    on  cs.customer_id = buyer.id 
    where cs.store_id = $1 AND cs.customer_id = $2;
    `;

    const res = await pool.query(query_text_customers, query);
    return res;
  } catch (e) {
    console.log(e);
    throw CustomError(e);
  }
};

export const getCustomersFromDb = async (query) => {
  try {
    //
    const query_text = ` 
   SELECT buyer.phone, 
   from customer_store cs
   left join 
   customer buyer 
   on cs.customer_id = buyer.id
   where cs.store_id = $1
   where 
   cs.email ILIKE $2 || "%" 
   OR 
   cs.name ILIKE $3 || "%" 
   OR
   cs.tag ILIKE $4 || "%" 
--order by p.created_at or name  desc
   order by $5 $6
   offset $7
 --limit 30 || 50 || 100
   limit $8 `;
    const res = await pool.query(query_text, query);
    return res;
  } catch (e) {
    throw CustomError(e);
  }
};

export const UpdateCustomerFromDb = async (field, query) => {
  const allowedField = ["email", "tag", "blacklisted", "name"];
  if (!allowedField.includes(field.toLowerCase())) {
    throw Error("Invalid field!");
  }

  try {
    //
    const query_text = ` UPDATE customers_store
    SET ${field} = $1;
    WHERE merchant_id = $2   
    returning *;
     `;
    const res = await pool.query(query_text, query);
    return res;
  } catch (e) {
    throw CustomError(e);
  }
};
export const DeleteCustomerFromStore = async (query) => {
  try {
    const query_text = ` DELETE FROM customer_store where merchant_id = $1`;
    const res = await pool.query(query_text, query);
    return res;
  } catch (e) {
    throw CustomError(e);
  }
};
