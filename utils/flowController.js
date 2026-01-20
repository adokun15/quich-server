/**
 This File does few things as follow: 
 - Decypts incoming request 
 - Validated a flow token and propagate the error;
 - Calls the func to handle the data and encrypt it back again!

 This function will be called by the flow enpoints( /onboard, /product)
 */

import { decryptRequest } from "./encryption";

const isValidFlowToken = (body) => {
  //dO THE Checks
};

export async function FlowControl(
  { request, private_key, passphrase },
  action,
) {
  let decryptedRequest = null;

  try {
    decryptedRequest = decryptRequest(request.body, private_key, passphrase);
  } catch (err) {
    throw new Error(err);
  }

  const { aesKeyBuffer, initialVectorBuffer, decryptedBody } = decryptedRequest;

  // console.log(decryptedBody);

  //Send an Error Message Back to User if token is invalid;
  if (!isValidFlowToken(decryptedBody.flow_token)) {
    const error_response = {
      error_msg: `Something went wrong! The message is no longer available`,
    };
    return {
      status: "error",
      error_status: 427,
      error_data: encryptResponse(
        error_response,
        aesKeyBuffer,
        initialVectorBuffer,
      ),
    };
  }

  //Process What the Next Screen Data does and do whatever with incoming data;
  //const screenResponse = await getNextScreenForProduct(decryptedBody);
  const screenResponse = await action(decryptedBody);

  //console.log("Response to Encrypt:", screenResponse);

  //Send Back Response to META
  return {
    status: "success",
    success_data: encryptResponse(
      screenResponse,
      aesKeyBuffer,
      initialVectorBuffer,
    ),
  };
}
