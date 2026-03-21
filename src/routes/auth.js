import express from "express";
import AsyncError from "../utils/error/AsyncError.js";

import { authController } from "../controllers/auth.js";

const authRoute = express.Router();

/* Rate limit middleware */

//Verify once
authRoute.route("/").get(AsyncError(authController));

export default authRoute;
