//Json web token midddleware
//import jwt from "jsonwebtoken";
import { createRemoteJWKSet, jwtVerify } from "jose";
import CustomError from "../error/error.js";

const JWKS = createRemoteJWKSet(
  new URL(
    `https://fcjjonixemxsnkqirwsj.supabase.co/auth/v1/.well-known/jwks.json`,
  ),
);

//From Whatsapp: 45mins
export async function VerifyMerchantToken(token) {
  const {
    payload: { sub, email },
  } = await jwtVerify(token, JWKS);

  return { userId: sub, email };
}

/*export function VerifyMerchantToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    //More Error!
    if (err?.message === "invalid token") {
      return { status: false, message: "Invalid Token Received!" };
    }
    if (err?.message === "jwt expired") {
      return { status: false, message: "Session has Expired!" };
    }
    if (err?.message) {
      return { status: false, message: err?.message };
    }

    return { status: true, payload };
  });
}
*/
