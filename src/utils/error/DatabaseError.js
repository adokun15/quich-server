class DatabaseError extends Error {
  constructor(message, status) {
    super(message);
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }


}

export default DatabaseError;
/*
 23505 - already exist; unique constraint
42703 - column name doesn't exist
*/
