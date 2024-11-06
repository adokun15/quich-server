import express from "express";
import { verifyToken } from "../db/firebase/users.js";
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

export default authRoute;
