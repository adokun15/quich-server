//Json web token midddleware

import jwt from "jsonwebtoken";

//From Whatsapp: 45mins
export function CreateMerchantToken(payload) {
  //Create Token;
  const jwtSignedToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
    audience: "whatsapp",
  });

  return jwtSignedToken || null;
}
