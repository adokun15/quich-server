import express, { json } from "express";
import cors from "cors";
import orderRoute from "./routes/orders.js";
import customerRoute from "./routes/customers.js";
import webhook from "./routes/webhooks.js";
import userRoute from "./routes/users.js";
import storeRoute from "./routes/store.js";
import authRoute from "./routes/auth.js";
import admin from "firebase-admin";
import serviceAccount from "./utils/secret.json" with {type: "json"};
import { configDotenv } from "dotenv";
import { globalErr } from "./utils/globalError.js";

configDotenv()

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(json());
app.use(cors());

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

app.listen(3030)
