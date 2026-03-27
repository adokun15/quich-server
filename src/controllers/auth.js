import { CreateMerchantToken } from "../utils/jwt/signToken.js";
import { VerifyMerchantToken } from "../utils/jwt/VerifyToken.js";

//Token validaton endpoint only!
export const authController = async (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  //Verify
  const data = VerifyMerchantToken(token);
  res.json(data);
};

//
export const RequestOtpController = async (req, res, next) => {};

export const VerifyOtpController = async (req, res, next) => {};

export const VerifyLoginTokenController = async (req, res, next) => {};
