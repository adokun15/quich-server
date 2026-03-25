//Run cron job to delete every saturday@11pm;
export const BatchDeleteWeeklyLogforDb = async () => {
  try {
    const res = await pool.query(
      `
      DELETE *
      from usage_log
      WHERE 'created_at is more than a week';
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

export const RetrieveWeeklyLogforMerchant = async () => {
  try {
    const res = await pool.query(
      `
      SELECT  
        logId,
        body_text,
        header_text,
        merchant_Id,
        created_at
      FROM usage_log
      WHERE merchant_Id = $1
      LIMIT $2 
      SORT created_at 
      `,
      query,
    );

    //success
    return {};
  } catch (e) {
    throw CustomError(e);
  }
};
