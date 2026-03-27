//Auth Table

import pool from "../utils/database/db";
import CustomError from "../utils/error/error";

//Create Otp
export async function CreateOtp({ phone, code }) {
  try {
    const res = await pool.query(
      `
            INSERT INTO otp_codes (identifier, code)
            VALUES ($1, $2)
            RETURNING id, identifier;            
        `,
      [phone, code],
    );
    return { data: res.rows[0] };
  } catch (e) {
    throw new CustomError(e);
  }
}

//Create lOGIN tOKEN
export async function CreateLoginToken({ identifier, token }) {
  try {
    const res = await pool.query(
      `
          INSERT INTO login_tokens (identifier, token)
          VALUES ($1, $2)
          RETURNING id, identifier;            
        `,
      [identifier, token],
    );
    return { data: res.rows[0] };
  } catch (e) {
    throw new CustomError(e);
  }
}

//Update lOGIN tOKEN
export async function UpdateLoginToken({ used, identifier }) {
  try {
    const res = await pool.query(
      `
          UPDATE login_tokens 
          SET USED = $1
          WHERE identifier = $2
          RETURNING *;            
        `,
      [used, identifier],
    );
    return { data: res.rows[0] };
  } catch (e) {
    throw new CustomError(e);
  }
}

//Update Otp
export async function UpdateOtpCode({ used, identifier }) {
  try {
    const res = await pool.query(
      `
          UPDATE otp_codes
          SET USED = $1
          WHERE identifier = $2
          RETURNING *;            
        `,
      [used, identifier],
    );
    return { data: res.rows[0] };
  } catch (e) {
    throw new CustomError(e);
  }
}

// VALIDATE OTP
export async function GetOtpCode({ phone }) {
  try {
    const res = await pool.query(
      `
              SELECT hashed_code, used FROM
              otp_codes WHERE 
              identifier = $1 AND
              used = FALSE AND
              expires_at > NOW()            
            `,
      [phone],
    );
    return { hashed_otp: res.rows[0]?.hashed_otp, used: res.rows[0]?.used };
  } catch (e) {
    throw new CustomError(e);
  }
}

// lOGIN tOKEN
export async function GetLoginToken(token) {
  try {
    const res = await pool.query(
      `
                SELECT * FROM
                login_tokens WHERE 
                token = $1 AND
                used = FALSE AND
                expires_at > NOW()            
            `,
      [token],
    );
    return { token_data: res.rows[0] };
  } catch (e) {
    throw new CustomError(e);
  }
}

//Batch dELETE  Otp / lOGIN tOKEN (MANUALLY)
export async function DeleteLoginToken() {
  try {
    await pool.query(`
                 DELETE FROM
                login_tokens WHERE 
                used = TRUE AND
                expires_at > NOW();            
            `);
    return "Used Login Token Deleted!";
  } catch (e) {
    throw new CustomError(e);
  }
}

export async function DeleteOTP() {
  try {
    await pool.query(`
                DELETE FROM
                otp_codes WHERE 
                used = TRUE AND
                expires_at > NOW();            
            `);
    return "Used OTPs Deleted!";
  } catch (e) {
    throw new CustomError(e);
  }
}
