import CustomError from "./error.js";

export default function AsyncError(asyncFunc) {
  return (req, res, next) => {
    const Timeout = new Promise((res, rej) => {
      setTimeout(() => {
        rej("Connection Timed Out.");
      }, 15 * 1000);
    });
    const yourData = asyncFunc(req, res, next);
    const newPromise = Promise.race([yourData, Timeout]).catch((err) =>
      next(err),
    );

    return newPromise;
  };
}
