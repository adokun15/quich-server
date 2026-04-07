import pool from "../utils/database/db";

//Run cron job to delete every 6 months
export const BatchDeleteLogforDb = async () => {
  try {
    const res = await pool.query(
      `
      DELETE *
      from usage_log
      WHERE 'created_at is more than a 180day';
      `,
      query,
    );

    //success
    return {};
  } catch (e) {
    throw CustomError(e);
  }
};

//Create log for every user activity;
export const CreateLogRepository = async ({
  merchant_id,
  action_type,
  action_statement,
  credit_used,
}) => {
  try {
    const res = await pool.query(
      `INSERT usage_log (
        merchant_id,
        action_type,
        action_statement,
        credit_used
      ) VALUES ($1, $2, $3, $4)
      returning * 
      `,
      [merchant_id, action_type, action_statement, credit_used],
    );

    //success
    return res.rows[0];
  } catch (e) {
    throw CustomError(e);
  }
};

//Get log for user based on 'time (7days)' and 'limit'
export const RetrieveWeeklyLogforMerchant = async ({
  page = 0,
  merchant_id,
}) => {
  try {
    const res = await pool.query(
      `
      SELECT  
      *
      FROM usage_log
      WHERE merchant_id = $1 AND created_at < '7 days'
      LIMIT 50 
      OFFSET $2
      ORDER BY created_at 
      `,
      [merchant_id, page],
    );
    return res.rows;
  } catch (e) {
    throw CustomError(e);
  }
};
