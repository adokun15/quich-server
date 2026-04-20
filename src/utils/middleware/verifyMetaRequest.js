import crypto from "crypto";

//VERIFY whatsapp message webhook is valid;
export function verifySignature(rawBody, signatureHeader, secret) {
  const expected =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader),
    Buffer.from(expected),
  );
}

//For Flow endpoint verification;
export function isRequestSignatureValid(req) {
  if (!process.env.META_APP_SECRET) {
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

  const hmac = crypto.createHmac("sha256", process.env.META_APP_SECRET);
  const digestString = hmac.update(req.rawBody).digest("hex");
  const digestBuffer = Buffer.from(digestString, "utf-8");

  if (!crypto.timingSafeEqual(digestBuffer, signatureBuffer)) {
    console.error("Error: Request Signature did not match");
    return false;
  }

  return true;
}
