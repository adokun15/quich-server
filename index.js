import express, { json } from "express";
import cors from "cors";
import orderRoute from "./routes/orders.js";
import customerRoute from "./routes/customers.js";
import webhook from "./routes/webhooks.js";
import userRoute from "./routes/users.js";
import storeRoute from "./routes/store.js";
import authRoute from "./routes/auth.js";
//import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { globalErr } from "./utils/globalError.js";

const app = express();

// Import `init.js` dynamically so its top-level code runs after dotenv has loaded env vars.
const { initFunc } = await import("./init.js");
initFunc();

app.use(json());
app.use(cors());
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);

//seller private customers route
app.use("/auth", authRoute);

//buyer public route
app.use("/store", storeRoute);

//seller private orders route
app.use("/orders", orderRoute);

//seller private customers route
app.use("/customers", customerRoute);

app.use("/webhook", webhook);

//seller private Account
app.use("/user", userRoute);

//Error
app.use(globalErr);

//for dev deployment
app.listen(3030, () => console.log("listening"));

//for live deployment only; Comment during local dev!
export default app;
