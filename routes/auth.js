import express from "express";
import { verifyToken } from "../db/firebase/users.js";
const authRoute = express.Router();

//For All end-user
authRoute.get("/verify-token/:token", async (req, res) => {
  const user = await verifyToken(req.params.token);
  res.json({ ...user });
});

export default authRoute;
