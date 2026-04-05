class DatabaseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default DatabaseError;
