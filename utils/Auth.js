import { getAuth } from "firebase-admin/auth";
import AsyncError from "./AsyncError.js";
import CustomError from "./error.js";

/*export const AuthorizationRouteMiddleware = AsyncError(async function (
  req,
  res,
  next
  ) {
    
  const token = req.get("Authorization").split(" ")[1];
  const decodedToken = await getAuth()
  .verifyIdToken(token)
  .catch((e) => {
    if (e?.errorInfo?.code === "auth/id-token-expired") {
      throw new CustomError("Session Timed Out!");
      } else {
        throw new CustomError("Could not Authenticate!");
    }
    });
    req.uid = decodedToken.uid;
    next();
    
    });
    */
export const AuthorizationRouteMiddleware = AsyncError(async function (
  req,
  res,
  next
) {
  const sessionCookie = req.get("Authorization").split(" ")[1];

  if (!sessionCookie) {
    throw new CustomError("Invalid Auth Token!", 400);
  }

  //auth/user-not-found

  const session = await getAuth()
    .verifySessionCookie(sessionCookie, true)
    .catch((e) => {
      if (e?.errorInfo?.code === "auth/id-token-expired") {
        throw new CustomError("Session Timed Out!");
      } else {
        throw new CustomError("Could not Authenticate!");
      }
    });

  req.uid = session.uid;
  next();
});
