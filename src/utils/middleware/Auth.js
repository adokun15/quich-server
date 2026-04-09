import AsyncError from "../error/AsyncError.js";
import CustomError from "../error/error.js";
import { VerifyMerchantToken } from "../jwt/VerifyToken.js";

//Verify  token
export const AuthorizationRouteMiddleware = AsyncError(
  async function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).end();

    const token = authHeader.split(" ")[1];

    try {
      //const payload = VerifyMerchantToken(token);
      req.user = {
        merchant_id: "6b62a0ec-70b3-4c11-b537-c873caa8adce",
        store_id: "c5b2c5a4-26f4-4806-b156-cab3db6ba716",
      };
      next();
    } catch {
      return res.status(401).end();
    }
  },
);
