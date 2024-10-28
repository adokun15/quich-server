import express from "express";
import { verifyToken } from "../db/firebase/users.js";
const authRoute = express.Router();

//For All end-user
authRoute.get("/verify-token/:token", async (req, res, next) => {
  try {
    const user = await verifyToken(req.params.token);
    res.json({ ...user });
  } catch (e) {
    next(e);
  }
});

export default authRoute;
