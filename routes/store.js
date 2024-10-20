import express from "express";
const storeRoute = express.Router();

//For All end-user
storeRoute.get("/", (req, res) => res.send("store Part"));

storeRoute
  .route("/:store-slug")
  .get((req, res) => {
    console.log(req.params.storeId);
    res.send("Test" + req.params.store - slug);
  })
  .post((req, res) => {
    console.log(req.params.storeId);
    res.send("Test" + req.params.storeId);
  });
export default storeRoute;
