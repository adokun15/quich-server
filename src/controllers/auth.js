import { CreateMerchantToken } from "../utils/jwt/signToken.js";
import { VerifyMerchantToken } from "../utils/jwt/VerifyToken.js";

//receive and transform request then send a response;
export const authController = async (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudF9pZCI6ImRhbmllbF9tZXJjaGFudF9pZCIsInN0b3JlX2lkIjoiZGFubnlfc3RvcmVfMTIxMjIiLCJzdG9yZV9zbHVnIjoiZGFubnlfc3RvcmUiLCJwaG9uZSI6IjgxMjk1ODQwMzUiLCJpYXQiOjE3NzM1MzUzNTIsImV4cCI6MTc3MzUzODk1MiwiYXVkIjoid2hhdHNhcHAifQ.sG1U8N4u_6nBfC62mE9RU59YKTEwn65Lmng26tJYABA";

  //Verify
  const data = VerifyMerchantToken(token);

  if (data?.status) {
    //Send back a cookie
    res.cookie("quich_login_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60, // 1 hour
      domain: process.env.NODE_ENV === "production" ? ".quich.shop" : ".lvh.me",
      path: "/",
    });
  }

  res.json(data);

  //Create temporary token
  /*
  
  const payload = {
    merchant_id: "daniel_merchant_id",
    store_id: "danny_store_12122",
    store_slug: "danny_store",
    phone: "8129584035",
  };
  
  const data = CreateMerchantToken(payload);
  
  console.log(data);
  
  res.json({ data });
  */
};
