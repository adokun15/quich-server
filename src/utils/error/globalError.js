export function globalErr(err, req, res, next) {
  let error = {};

  error.statusCode = err?.statusCode || 500;
  error.status = err?.status || "Error";
  error.message =
    typeof err === "string" ? err : err?.message || "SOMERHING WENT WRONG!";

  if (err?.message?.toLowerCase().includes("unavailable")) {
    error.message = "Connection Timed Out!";
  }
  console.log(error);

  res.status(error.statusCode).json(error);
}
