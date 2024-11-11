/*
 {
200 : OK 
201 : created
}
{
400: BAD REQUEST
401: unauthorized
403: forbidden
404: not found
429 : too-many-request
}
{
500: internal server error
}
 */

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
