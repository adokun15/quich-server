import express, { json } from "express";
import cors from "cors";
import inventoryRoute from "./routes/inventory.js";
import orderRoute from "./routes/orders.js";
import customerRoute from "./routes/customers.js";
import userRoute from "./routes/users.js";
import storeRoute from "./routes/store.js";
import authRoute from "./routes/auth.js";
import admin from "firebase-admin";
import serviceAccount from "./utils/secret.json" with {type: "json"};
import { configDotenv } from "dotenv";

configDotenv()



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(json());
app.use(cors());

//seller private customers route
app.use("/auth", authRoute);

//seller private inventory route
app.use("/inventory", inventoryRoute);

//seller private orders route
app.use("/order", orderRoute);

//seller private customers route
app.use("/customer", customerRoute);

//seller private Account
app.use("/user", userRoute);

//buyer public route
app.use("/store", storeRoute);

//Error
app.use(function (err, req, res, next) {
  console.log(err.stack);
  
  res.status(500).send("Something is Not Right");
});
app.listen(5050);
