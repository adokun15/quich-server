import express from "express";
const orderRoute = express.Router();

//Get Merchant Orders
orderRoute.get("/", (req, res) => {});

orderRoute
  .route("/:orderId")
  .get((req, res) => {
    //Read by merchant
    console.log(req.params.orderId);
    res.send("Test" + req.params.orderId);
  })
  .post((req, res) => {
    //Created by customer
    res.send("Test" + req.params.orderId);
  })
  .patch((req, res) => {
    //Mark as Delivered
  });

export default orderRoute;
