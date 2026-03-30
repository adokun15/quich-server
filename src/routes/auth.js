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

//Whatsapp!
authRoute
  .route("/verify-whatsapp-token")
  .get(AsyncError(VerifyLoginTokenController));

//Browser!
/* Rate limit middleware: 3req / 5min */
authRoute.route("/request-otp").get(AsyncError(RequestOtpController));

/** */
authRoute.route("/verify-otp").get(AsyncError(VerifyOtpController));
export default authRoute;
