import { getMerchantInfo } from "../../services/users.js";
import AsyncError from "../error/AsyncError.js";
import CustomError from "../error/error.js";
import { VerifyMerchantToken } from "../jwt/VerifyToken.js";

//Verify  token
/*export const AuthorizationRouteMiddleware = AsyncError(
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
*/

export const AuthorizationRouteMiddleware = AsyncError(
  async function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).end();

    const token = authHeader.split(" ")[1];

    try {
      console.log(token);
      const { userId } = await VerifyMerchantToken(token);

      console.log(userId);
      //Get store Id
      const store = await getMerchantInfo(userId);

      console.log(store);
      req.user = {
        merchant_id: "6b62a0ec-70b3-4c11-b537-c873caa8adce",
        store_id: "c5b2c5a4-26f4-4806-b156-cab3db6ba716",
      };
      next();
    } catch (e) {
      console.log(e);
      if (e.code === "ERR_JWT_EXPIRED") {
        throw new CustomError("Session timed-out", 401);
      }

      if (e.message === "fetch failed") {
        throw new CustomError("Network failed! ", 500);
      }

      if (e.code === "ERR_JWKS_TIMEOUT") {
        throw new CustomError("Network failed! ", 500);
      }
      if (e.code === "ERR_JWS_INVALID") {
        throw new CustomError("Invalid token received! ", 404);
      }

      throw new CustomError(e?.message, 500);
    }
  },
);

/*{
  iss: 'https://fcjjonixemxsnkqirwsj.supabase.co/auth/v1',
  sub: 'a4491c08-43f0-4edb-b478-2ba75de90549',
  aud: 'authenticated',
  exp: 1777391736,
  iat: 1777388136,
  email: 'amosdaniel2005@gmail.com',
  phone: '',
  app_metadata: { provider: 'email', providers: [ 'email' ] },
  user_metadata: {
    email: 'amosdaniel2005@gmail.com',
    email_verified: true,
    phone_verified: false,
    sub: 'adadas'
  },
  role: 'authenticated',
  aal: 'aal1',
  amr: [ { method: 'otp', timestamp: 1777388136 } ],
  session_id: 'e640fe1a-f2af-4487-85ec-bf1a0e5788ac',
  is_anonymous: false
}*/
