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

import { globalErr } from "./utils/error/globalError.js";
import endpointFlowRoute from "./routes/flow.js";
import productRoute from "./routes/products.js";

const app = express();

app.use(json());
app.use(cors());

//Browser authorization
app.use("/auth", authRoute);

app.use("/store", storeRoute);

app.use("/products", productRoute);

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
//if (process.env.NODE_ENV === "development") {
//}
app.listen(3030, () => console.log("listening"));

//for live deployment only; Comment during local dev!
export default app;
