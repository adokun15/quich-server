//transaction: instead
export const CreateSubscriptionforMerchant = async () => {
  try {
    const res = await pool.query(
      `
      INSERT INTO subcription(
        merchant_id,
        phone,
        email,
        renewDate,
        paymentDate,
        auth_code,
        amount
        plan,
      )
      VAL 
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

//Index
export const GetSubscriptionDetailForMerchant = (query) => {};

export const UpdateSubscriptionforMerchant = () => {};
