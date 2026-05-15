import crypto from "crypto";

export function verifyPaystackSignature(rawBody, signature, secret) {
  if (!signature) return false;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  const expected = Buffer.from(hash, "hex");
  const incoming = Buffer.from(signature, "hex");

  if (expected.length !== incoming.length) return false;

  return crypto.timingSafeEqual(expected, incoming);
}
