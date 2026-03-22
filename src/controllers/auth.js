import { CreateMerchantToken } from "../utils/jwt/signToken.js";
import { VerifyMerchantToken } from "../utils/jwt/VerifyToken.js";

//Token validaton endpoint only!

export const authController = async (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];

  //Verify
  const data = VerifyMerchantToken(token);

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
