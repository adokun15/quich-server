import express from "express";
import { getAuth } from "firebase-admin/auth";

import { getAllCustomers } from "../db/firebase/customers.js";
import AsyncError from "../utils/AsyncError.js";
import CustomError from "../utils/error.js";

const customerRoute = express.Router();

//Provide-Uid-Middleware
customerRoute.use(
  AsyncError(async (req, res, next) => {
    const token = req.get("Authorization").split(" ")[1];
    const decodedToken = await getAuth()
      .verifyIdToken(token)
      .catch((e) => {
        if (e?.errorInfo?.code === "auth/id-token-expired") {
          throw new CustomError("Session Timed Out!");
        } else {
          throw new CustomError("Could not Authenticate!");
        }
      });
    req.uid = decodedToken.uid;
    next();
  })
);

customerRoute.route("/").get(
  AsyncError(async (req, res, next) => {
    const merchantId = req?.uid;

    if (!merchantId) {
      throw CustomError("Unauthorized Access to Customer Data!", 403);
    }
    const customers = await getAllCustomers(merchantId);
    res.json({ customers });
  })
);
export default customerRoute;
