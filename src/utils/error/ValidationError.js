class ValidationError extends Error {
  constructor(message, statusCode, field) {
    super(message);
    this.status = statusCode;
    this.field = field;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ValidationError;
