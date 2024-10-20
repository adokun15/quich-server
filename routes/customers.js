import express from "express";
const customerRoute = express.Router();

//For All end-user
customerRoute.get("/", (req, res) => res.send("customer Part"));

customerRoute
  .route("/:customerId")
  .get((req, res) => {
    console.log(req.params.customerId);
    res.send("Test" + req.params.customerId);
  })
  .post((req, res) => {
    console.log(req.params.customerId);
    res.send("Test" + req.params.customerId);
  });
export default customerRoute;
