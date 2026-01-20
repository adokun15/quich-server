//Flow endpoint
import express from "express";
import {
  decryptRequest,
  encryptResponse,
  FlowEndpointException,
} from "../utils/encryption.js";
import {
  getNextScreenForCreatingNewProduct,
  getNextScreenForProduct,
} from "../db/whatapp/flow-endpoints/createProduct.js";
import crypto from "crypto";
import {
  getNextScreenForOnboarding,
  OnboardFlowControl,
} from "../db/whatapp/flow-endpoints/onboard_flow.js";
import { FlowControl } from "../utils/flowController.js";

const endpointFlowRoute = express.Router();

function isRequestSignatureValid(req) {
  if (!APP_SECRET) {
    console.warn(
      "App Secret is not set up. Please Add your app secret in /.env file to check for request validation",
    );
    return true;
  }

  const signatureHeader = req.get("x-hub-signature-256");
  const signatureBuffer = Buffer.from(
    signatureHeader.replace("sha256=", ""),
    "utf-8",
  );

  const hmac = crypto.createHmac("sha256", APP_SECRET);
  const digestString = hmac.update(req.rawBody).digest("hex");
  const digestBuffer = Buffer.from(digestString, "utf-8");

  if (!crypto.timingSafeEqual(digestBuffer, signatureBuffer)) {
    console.error("Error: Request Signature did not match");
    return false;
  }
  return true;
}

const {
  META_APP_SECRET,
  META_GENERATED_PRIVATE_KEY,
  META_PASSPHRASE = "",
} = process.env;

// Return status code 432 if request signature does not match.
endpointFlowRoute.use((req, res) => {
  //1. Key is Valid
  if (!META_GENERATED_PRIVATE_KEY) {
    //Log Error to Firebase!
    throw new Error(
      'Private key is empty. Please check your env variable "META_GENERATED_PRIVATE_KEY".',
    );
  }

  if (!isRequestSignatureValid(req)) {
    return res.status(432).send();
  }
});

endpointFlowRoute.route("/onboard").post(async (req, res) => {
  try {
    const onboardFlow = await FlowControl(
      {
        request: req,
        private_key: META_GENERATED_PRIVATE_KEY,
        passphrase: META_PASSPHRASE,
      },
      getNextScreenForOnboarding,
    );

    const { status, error_status, success_data, error_data } = onboardFlow;

    if (status === "success") {
      res.status(200).send(success_data);
    }

    if (status === "error") {
      res.status(error_status).send(error_data);
    }
  } catch {
    //Log Error To Firebase / Log Text!!
    console.error(err);
    if (err instanceof FlowEndpointException) {
      return res.status(err.statusCode).send();
    }
    return res.status(500).send();
  }
});

//Updates will be through a link:
endpointFlowRoute.route("/product").post(async (req, res) => {
  try {
    const ProductCreationFlow = await FlowControl(
      {
        request: req,
        private_key: META_GENERATED_PRIVATE_KEY,
        passphrase: META_PASSPHRASE,
      },
      getNextScreenForCreatingNewProduct,
    );

    const { status, error_status, success_data, error_data } =
      ProductCreationFlow;

    if (status === "success") {
      res.status(200).send(success_data);
    }

    if (status === "error") {
      res.status(error_status).send(error_data);
    }
  } catch {
    //Log Error To Firebase / Log Text!!
    console.error(err);
    if (err instanceof FlowEndpointException) {
      return res.status(err.statusCode).send();
    }
    return res.status(500).send();
  }
});

/*
endpointFlowRoute
  .route("/testimonial")
  .get((req, res) => {})
  .post((req, res) => {});

endpointFlowRoute
  .route("/store")
  .get((req, res) => {})
  .post((req, res) => {});

endpointFlowRoute
  .route("/account")
  .get((req, res) => {})
  .post((req, res) => {});


*/

export default endpointFlowRoute;
