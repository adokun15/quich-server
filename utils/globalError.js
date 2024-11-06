export function globalErr(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  res.status(err.statusCode).json({
    message: err?.message || "Something Went Wrong",
    status: err?.statusCode,
  });
}
