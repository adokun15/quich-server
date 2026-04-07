import pool from "../utils/database/db.js";
//transactions
export const CreateSubscriptionforMerchant = async ({
  subscription_code = null,
  plan_code,
  currency = "NGN",
  amount,
  status,
  merchant_id,
  customer_code,
  email_token,
  start_date,
  end_date = null,
  next_payment_date,
  created_at,
}) => {
  try {
    const res = await pool.query(
      `
      INSERT INTO subscriptions(
        subscription_code,
        plan_code,
        currency,
        amount,
        status,
        merchant_id,
        customer_code,
        email_token,
        start_date,
        end_date,
        next_payment_date,
        created_at
        )
      VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `,
      [
        subscription_code,
        plan_code,
        currency,
        amount,
        status,
        merchant_id,
        customer_code,
        email_token,
        start_date,
        end_date,
        next_payment_date,
        created_at,
      ],
    );

    //success
    return { subscription: res.rows[0] };
  } catch (e) {
    //Handle Database Error;
    throw CustomError(e);
  }
};

export const GetSubscriptionDetailForMerchant = async (query) => {
  try {
    const res = await pool.query(
      `
        SELECT * FROM subscriptions
        WHERE merchant_id = $1 AND ORDER BY created_at;
        `,
      query,
    );
    return { subscription: res.rows };
  } catch (e) {
    throw CustomError(e);
  }
};

export const UpdateSubscriptionforMerchant = async ({ updates, id }) => {
  const setClause = Object.keys(updates)
    .map((key, i) => `"${key}" = $${i + 1}`)
    .join(", ");

  //Just the [value1, value2]
  const values = Object.values(updates);
  values.push(id);
  try {
    const res = await pool.query(
      `
        UPDATE subscriptions SET ${setClause}
        where id = ${values.length} OR subscription_code = ${values.length};
        `,
      values,
    );
  } catch (e) {
    throw new CustomError(e);
  }
};

//Invoice
export const CreateInvoice = async ({
  invoice_code,
  subscription_code,
  period_start,
  period_end,
  amount,
  currency,
  created_at,
}) => {
  try {
    const res = await pool.query(
      `

      --INSERT INTO invoices (invoice_id, status, amount)
-- VALUES ($1, $2, $3)

      INSERT INTO subscription_invoices(
        invoice_code, 
        subscription_code,
        period_start,
        period_end,
        amount,
        currency,
        created_at
        )
      VALUES ( $1, $2, $3, $4, $5, $6, $7)
      --ON CONFLICT (invoice_id)
     -- DO UPDATE SET status = EXCLUDED.status;
      RETURNING *;    
    `,
      [
        invoice_code,
        subscription_code,
        period_start,
        period_end,
        amount,
        currency,
        created_at,
      ],
    );
    return { invoice: res.rows[0] };
  } catch (e) {
    throw CustomError(e);
  }
};

export const GetSingleInvoiceDetailForMerchant = async ({
  subscription_code,
  invoice_code,
}) => {
  try {
    const res = await pool.query(
      `
        select 
        si.*,
        COALESCE(jsonb_agg(sp.*) FILTER (WHERE sp.invoice_code IS NOT NULL), '[]') 
        AS payments    
        FROM subscription_invoices
        LEFT JOIN subscription_payments sp
        on si.invoice_code = sp.invoice_code
        WHERE si.subcription_code = $2 AND (si.invoice_code = $1 OR si.id = $1);
        GROUP BY si.invoice_code;
        `,
      [invoice_code, subscription_code],
    );
    return { invoice: res.rows[0] };
  } catch (e) {
    throw CustomError(e);
  }
};

export const GetInvoicesDetailForMerchant = async ({ query, filter }) => {
  try {
    const res = await pool.query(
      `
        SELECT * FROM subscription_invoices
        WHERE subscription_code = $1
        ---fILTER BY STATUS AND LATER PERIOD_DATE
        ORDER BY created_at DESC
        OFFSET 0
        LIMIT 10
        `,
      query,
    );
    return { invoices: res.rows };
  } catch (e) {
    throw CustomError(e);
  }
};

export const UpdateInvoiceforMerchant = async ({ updates, id }) => {
  const setClause = Object.keys(updates)
    .map((key, i) => `"${key}" = $${i + 1}`)
    .join(", ");

  const values = Object.values(updates);
  values.push(id);
  try {
    const res = await pool.query(
      `
        UPDATE subscription_invoices SET ${setClause}
        where id = ${values.length} OR invoice_code = ${values.length};
        `,
      values,
    );
  } catch (e) {
    throw new CustomError(e);
  }
};

//pAYMENT
export const CreatePaymentforMerchant = async ({
  invoice_code,
  reference,
  status,
  paid_at,
  amount,
  created_at,
}) => {
  try {
    const res = await pool.query(
      `
      INSERT INTO subscription_payments(
        invoice_code, 
        reference,
        status,
        paid_at
        amount,
        created_at
        )
      VALUES ( $1, $2, $3, $4, $5, $6)
      RETURNING *;
    `,
      [invoice_code, reference, status, paid_at, amount, created_at],
    );
    return { payment: res.rows[0] };
  } catch (e) {
    throw CustomError(e);
  }
};
