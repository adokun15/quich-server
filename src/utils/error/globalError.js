export function globalErr(err, req, res, next) {
  let error = {};

  error.code = err?.status || 500;
  error.message =
    typeof err === "string" ? err : err?.message || "SOMERHING WENT WRONG!";
  error.details = err?.details || [];

  error.status = err?.status && false;
  //  error.statusCode = err?.statusCode || 500;
  // if (err?.message?.toLowerCase().includes("unavailable")) {
  // error.message = "Connection Timed Out!";
  //}
  //console.log(err);
  res.status(error.code).json(error);
}
