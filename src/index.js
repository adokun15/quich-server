import express, { json } from "express";
import cors from "cors";
import orderRoute from "./repository/routes/orders.js";
import customerRoute from "./repository/routes/customers.js";
import webhook from "./repository/routes/webhooks.js";
import userRoute from "./repository/routes/users.js";
import storeRoute from "./repository/routes/store.js";
import authRoute from "./repository/routes/auth.js";
//import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { globalErr } from "./utils/error/globalError.js";
import endpointFlowRoute from "./repository/routes/flow.js";

const app = express();

app.use(json());
app.use(cors());

// store the raw request body to use it for signature verification
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      req.rawBody = buf?.toString(encoding || "utf8");
    },
  }),
);

//Browser authorization
app.use("/auth", authRoute);

//buyer public route
app.use("/store", storeRoute);

//seller private orders route
app.use("/orders", orderRoute);

//seller private customers route
app.use("/customers", customerRoute);

app.use("/webhook", webhook);

app.use("/flow", endpointFlowRoute);

//seller private Account
app.use("/user", userRoute);

//Error
app.use(globalErr);

//for dev deployment
app.listen(3030, () => console.log("listening"));

//for live deployment only; Comment during local dev!
export default app;
