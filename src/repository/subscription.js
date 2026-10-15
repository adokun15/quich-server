import { ClauseExtractor } from "../utils/database/ClauseExtractor.js";
import pool from "../utils/database/db.js";
import CustomError from "../utils/error/error.js";

/*
charge.success

start date,
merchant_id,

*/
//----- Subscription --------------
export const CreateSubscriptionforMerchant = async ({
  subscription_code = null,
  plan_code,
  plan_name,
  email,
  invoice_limit,
  interval,
  currency = "NGN",
  amount,
  subscription_status,
  customer_code,
  email_token,
  next_payment_date,
  merchant_id,
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
        customer_code,
        email_token,
        next_payment_date,
        plan_name,
        email,
        invoice_limit,
        interval,
        merchant_id
        )
      VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `,
      [
        subscription_code,
        plan_code,
        currency,
        amount,
        subscription_status,
        customer_code,
        email_token,
        next_payment_date,
        plan_name,
        email,
        invoice_limit,
        interval,
        merchant_id,
      ],
    );
    //success
    return { subscription: res.rows[0] };
  } catch (e) {
    //Handle Database Error;
    throw new CustomError(e?.message);
  }
};

export const GetSubscriptionDetailForMerchant = async ({ identifier }) => {
  try {
    let queryText = "";

    if (identifier?.startsWith("SUB_")) {
      queryText = `
        SELECT * FROM subscriptions
        WHERE  subscription_code = $1 ORDER BY created_at;
        `;
    } else {
      queryText = `
        SELECT * FROM subscriptions
        WHERE  merchant_id = $1 ORDER BY created_at;
        `;
    }
    const res = await pool.query(queryText, [identifier]);
    return res.rows || {};
  } catch (e) {
    console.log(e);
    throw new CustomError(e?.message);
  }
};

export const UpdateSubscriptionforMerchant = async ({
  updates,
  id: identifier,
}) => {
  const { setClause, values, id } = ClauseExtractor({
    updates,
    id: identifier,
  });

  try {
    const res = await pool.query(
      `
        UPDATE subscriptions SET ${setClause}
        where id = $${id}::UUID OR subscription_code = $${id}::TEXT
        RETURNING id, subscription_code, status, plan_code, merchant_id, email_token;
        `,
      values,
    );
    return res.rows[0];
  } catch (e) {
    throw new CustomError(e);
  }
};

//-------- Invoice -----------
export const CreateInvoice = async ({
  invoice_code,
  subscription_code,
  period_start,
  period_end,
  amount,
  created_at,
}) => {
  try {
    const res = await pool.query(
      `
      INSERT INTO subscription_invoices(
        invoice_code, 
        subscription_code,
        period_start,
        period_end,
        amount,
        created_at
        )
      VALUES ( $1, $2, $3, $4, $5, $6)
      RETURNING *;    
    `,
      [
        invoice_code,
        subscription_code,
        period_start,
        period_end,
        amount,
        created_at,
      ],
    );
    return { invoice: res.rows[0] };
  } catch (e) {
    throw new CustomError(e);
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
        FROM subscription_invoices si
        LEFT JOIN subscription_payments sp
        on si.invoice_code = sp.invoice_code
        WHERE si.subscription_code = $2
        AND (si.invoice_code = $1) 
        GROUP BY si.invoice_code, si.id;
        `,
      [invoice_code, subscription_code],
    );

    return res.rows[0] || {};
  } catch (e) {
    console.log(e);
    throw new CustomError(e);
  }
};

export const GetInvoicesDetailForMerchant = async ({
  subscription_code,
  filter,
}) => {
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
      [subscription_code],
    );
    return res.rows;
  } catch (e) {
    throw new CustomError(e);
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

//--------------- PAYMENT ------------------
export const CreatePaymentforMerchant = async ({
  merchant_id,
  invoice_code,
  reference,
  status,
  paid_at,
  amount,
}) => {
  try {
    const res = await pool.query(
      `
      INSERT INTO subscription_payments(
        merchant_id, 
        invoice_code, 
        reference,
        status,
        paid_at,
        amount
        )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `,
      [merchant_id, invoice_code, reference, status, paid_at, amount],
    );
    return { payment: res.rows[0] };
  } catch (e) {
    throw new CustomError(e);
  }
};

//PAYMENT List
export const GetPaymentsListForMerchant = async ({ merchant_id }) => {
  try {
    const res = await pool.query(
      `
        SELECT * FROM subscription_payments
        WHERE merchant_id = $1
        ORDER BY created_at DESC
        OFFSET 0
        LIMIT 10
    `,
      [merchant_id],
    );
    return { payments: res.rows };
  } catch (e) {
    throw new CustomError(e?.message);
  }
};
