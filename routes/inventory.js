import express from "express";
const inventoryRoute = express.Router();
import {
  getPrimeUserInventories,
  getPrimeUserSingleInventory,
} from "../db/firebase/inventory.js";
//All inventory Paystack inventory
inventoryRoute.get("/", () => {});

inventoryRoute.route("/:inventoryId").get(getPrimeUserSingleInventory);

export default inventoryRoute;
