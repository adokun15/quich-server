import express from "express";
import { EmailVerified, verifyToken } from "../db/firebase/users.js";
import AsyncError from "../utils/AsyncError.js";
const authRoute = express.Router();

//For All end-user
authRoute.get(
  "/verify-token/:token",
  AsyncError(async (req, res, next) => {
    const user = await verifyToken(req.params.token);
    res.json({ ...user });
  })
);
authRoute.get(
  "/email-verified/:email",
  AsyncError(async (req, res, next) => {
    const message = await EmailVerified(req.params.email);
    res.json({ message });
  })
);

export default authRoute;
