export function verifyPaystackSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader) return false;

  const expectedHash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  const incoming = Buffer.from(signatureHeader.replace("sha512=", ""), "hex");

  const expected = Buffer.from(expectedHash, "hex");

  console.log(expected, incoming);
  return crypto.timingSafeEqual(expected, incoming);
}
