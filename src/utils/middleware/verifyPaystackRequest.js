import crypto from "crypto";

export function verifyPaystackSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader) return false;

  const expectedHash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  console.log(signatureHeader);
  console.log(expectedHash);
  console.log(secret);

  const incoming = Buffer.from(signatureHeader.replace("sha512=", ""), "hex");

  const expected = Buffer.from(expectedHash, "hex");

  return crypto.timingSafeEqual(expected, incoming);
}
