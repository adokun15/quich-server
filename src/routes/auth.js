import express from "express";
import AsyncError from "../utils/AsyncError.js";
import { authController } from "../../controllers/auth.js";
const authRoute = express.Router();

/* Rate limit middleware */
authRoute.route("/").get(AsyncError(authController));

export default authRoute;
