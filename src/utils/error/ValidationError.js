class ValidationError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.status = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ValidationError;
