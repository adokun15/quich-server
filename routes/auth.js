import express from "express";
import {
  createSessionCookies,
  //EmailVerified,
  //verifyToken,
  VerifyUserSession,
} from "../db/firebase/users.js";
import AsyncError from "../utils/AsyncError.js";
const authRoute = express.Router();

authRoute
  .route("/session")
  .post(
    AsyncError(async (req, res, next) => {
      const cookie = await createSessionCookies(req.body.idToken);
      res.json({ cookie });
    })
  )
  .get(
    AsyncError(async (req, res, next) => {
      //Breaker header
      const cookie = req.get("Authorization").split(" ")[1];
      const data = await VerifyUserSession(cookie);
      res.json({ data });
    })
  );

//For All end-user
//authRoute.get(
///  "/verify-token/:token",
// AsyncError(async (req, res, next) => {
//   const user = await verifyToken(req.params.token);
//  res.json({ ...user });
// })
//);

//authRoute.get(
// "/email-verified/:email",
// AsyncError(async (req, res, next) => {
//   const message = await EmailVerified(req.params.email);
//   res.json({ message });
// })
//);

export default authRoute;
