//Verify and Transform middleware;
export const paystack_vs = (req, res, next) => {
  try {
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    //    if (hash == req.headers["x-paystack-signature"]) {

    next();
  } catch (e) {
    console.log(e);
  }
};
