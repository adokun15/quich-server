import express from "express";
import AsyncError from "../utils/error/AsyncError.js";

import {
  authController,
  onBoardController,
  //  RequestOtpController,
  // VerifyLoginTokenController,
  //VerifyOtpController,
} from "../controllers/auth.js";
import { whatsapp_request_phone_verification_controller } from "../controllers/whatsapp.js";

const authRoute = express.Router();

//Verify once
authRoute.route("/").get(AsyncError(authController));

//Onboard: use rate limit here
authRoute.route("/onboard").post(AsyncError(onBoardController));

//Whatsapp
authRoute
  .route("/request_whatsapp_verification")
  .get(AsyncError(whatsapp_request_phone_verification_controller));

//Browser!

/* Rate limit middleware: 5req / 2mins */
//authRoute.route("/request-otp").get(AsyncError(RequestOtpController));

/* Rate limit middleware: 10req / min - IP address */
//authRoute.route("/verify-otp").get(AsyncError(VerifyOtpController));
export default authRoute;
