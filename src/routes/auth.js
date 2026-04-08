import express from "express";
import AsyncError from "../utils/error/AsyncError.js";

import {
  authController,
  RequestOtpController,
  VerifyLoginTokenController,
  VerifyOtpController,
} from "../controllers/auth.js";

const authRoute = express.Router();

//Verify once
authRoute.route("/").get(AsyncError(authController));

//Whatsapp
authRoute
  .route("/verify-whatsapp-token")
  .get(AsyncError(VerifyLoginTokenController));

//Browser!
/* Rate limit middleware: 5req / 2mins */
authRoute.route("/request-otp").get(AsyncError(RequestOtpController));

/* Rate limit middleware: 10req / min - IP address */
authRoute.route("/verify-otp").get(AsyncError(VerifyOtpController));
export default authRoute;
