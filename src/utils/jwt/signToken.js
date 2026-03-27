//Json web token midddleware

import jwt from "jsonwebtoken";

//From Whatsapp: 45mins
export function CreateMerchantToken(payload, expires_at) {
  //Create Token;
  const jwtSignedToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: expires_at || "1h",
    audience: "whatsapp",
  });

  return jwtSignedToken || null;
}
