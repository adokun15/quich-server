//Json web token midddleware

import jwt from "jsonwebtoken";

//From Whatsapp: 45mins
export function VerifyMerchantToken(token) {
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
