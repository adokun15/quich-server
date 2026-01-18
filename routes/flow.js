//Flow endpoint
import express from "express";
import {
  decryptRequest,
  encryptResponse,
  FlowEndpointException,
} from "../utils/encryption.js";
import { getNextScreenForProduct } from "../db/whatapp/flow-endpoints/createProduct.js";
import crypto from "crypto";

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

endpointFlowRoute.route("/onboard").post(async (req, res) => {
  //1. Key is Valid
  if (!META_GENERATED_PRIVATE_KEY) {
    //Log Error to Firebase!
    throw new Error(
      'Private key is empty. Please check your env variable "META_GENERATED_PRIVATE_KEY".',
    );
  }

  //2. Signature reqest is valid

  // Return status code 432 if request signature does not match.
  if (!isRequestSignatureValid(req)) {
    return res.status(432).send();
  }

  let decryptedRequest = null;

  try {
    //3. Decrypt reqest and extract data
    decryptedRequest = decryptRequest(
      req.body,
      META_GENERATED_PRIVATE_KEY,
      PASSPHRASE,
    );
  } catch (err) {
    //Log Error To Firebase!
    console.error(err);
    if (err instanceof FlowEndpointException) {
      return res.status(err.statusCode).send();
    }
    return res.status(500).send();
  }

  //4.Do something with the data
  const { aesKeyBuffer, initialVectorBuffer, decryptedBody } = decryptedRequest;

  console.log("💬 Decrypted Request:", decryptedBody);

  // TODO: Uncomment this block and add your *flow token validation logic*.

  // If the flow token becomes invalid, return HTTP code 427 to disable the flow and show the message in `error_msg` to the user
  // Refer to the docs for details https://developers.facebook.com/docs/whatsapp/flows/reference/error-codes#endpoint_error_codes

  //4. Send an Error Message Back to User if token is invalid;
  /*
  if (!isValidFlowToken(decryptedBody.flow_token)) {
    const error_response = {
      error_msg: `The message is no longer available`,
    };
    return res
    .status(427)
      .send(
        encryptResponse(error_response, aesKeyBuffer, initialVectorBuffer)
        );
        }
        */

  //5.Process Next Screen Data **
  const screenResponse = await getNextScreenForProduct(decryptedBody);
  console.log("👉 Response to Encrypt:", screenResponse);

  //6. Send Back Response to META
  res.send(encryptResponse(screenResponse, aesKeyBuffer, initialVectorBuffer));
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

endpointFlowRoute
  .route("/product")
  .get((req, res) => {})
  .post((req, res) => {});

*/

export default endpointFlowRoute;
