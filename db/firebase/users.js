import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import CustomError from "../../utils/error.js";

export async function VerifyUserSession(sessionCookie) {
  if (!sessionCookie) {
    throw new CustomError("Invalid Auth Token!", 400);
  }

  try {
    const session = await getAuth()
      .verifySessionCookie(sessionCookie, true)
      .then((token) => token.uid)
      .then((uid) => {
        return getAuth().getUser(uid);
      });

    return {
      userId: session?.uid,
      emailVerified: session?.emailVerified,
      role: session?.customClaims?.onboard, // step:
    };
  } catch (error) {
    const message =
      error?.errorInfo?.message ||
      error?.code ||
      error?.message ||
      "Session verification failed!";
    throw new CustomError(message, 400);
  }
}

export const createSessionCookies = async (idToken) => {
  if (!idToken) {
    throw new CustomError("Invalid Auth Token!", 400);
  }

  // Set session expiration to 3 days;
  const expiresIn = 60 * 60 * 24 * 3 * 1000;

  try {
    const c = await getAuth()
      .createSessionCookie(idToken, { expiresIn })
      .then((session) => session);

    return c;
  } catch (error) {
    console.log(error);
    throw new CustomError("Error: Could not create session!", 500);
  }
};

export const EmailVerified = async (email) => {
  const currentUser = await getAuth()
    .getUserByEmail(email)
    .then((user) => user);

  if (!currentUser.emailVerified) {
    throw new CustomError("Your Email is not yet verified!", 500);
  }

  const next14Days = 14 * 24 * 60 * 60 * 1000;

  const date = new Date();

  date.setMilliseconds(next14Days);

  await getFirestore().collection("users/").doc(`${currentUser.uid}`).set({
    userId: currentUser.uid,
    account: {}, //No bank info
    link: "", //No store: no whatapp, order, customer
  });

  return getAuth()
    .setCustomUserClaims(currentUser.uid, { role: "free" })
    .then(() => "Your Email Has been successfully Verified. Login To Continue!")
    .catch((e) => {
      console.log(e);
      throw new CustomError(e?.errorInfo?.code || "Email verification failed");
    });
};


//Deprecated
export const verifyToken = async function (token) {
  console.log(token)
  return await getAuth()
    .verifyIdToken(token)
    .then((token) => token.uid)
    .then((uid) => {
      return getAuth().getUser(uid);
    })
    .then(async (user) => {
      const prop = await getFirestore()
        .collection("users")
        .doc(`${user?.uid}`)
        .get();
 
      return {
        ...prop.data(),
        email: user?.email,
        name: user?.displayName,
        role: user?.customClaims?.role || null,
        emailVerified: user?.emailVerified,
      };
    })
    .catch((err) => {
      console.log(err);
      if (err?.errorInfo?.code === "auth/id-token-expired") {
        throw new CustomError("Session Timed out!", 401);
      } else if (err?.errorInfo?.code === "app/network-error") {
        throw new CustomError("No Internet Connection", 500);
      } else if (err?.errorInfo?.code === "auth/argument-error") {
        throw new CustomError("Unauthorized Access!", 401);
      } else if (err?.errorInfo?.code === "app/network-timeout") {
        throw new CustomError("Slow  Internet Detected!", 500);
      } else {
        throw new CustomError(
          err?.errorInfo?.code || "Could not Authenticate!"
        );
      }
    });
};


//Get user Db
export const getUserDb = async function (uid) {
  try {
    const user = (
      await getFirestore().collection("users/").doc(`${uid}`).get()
    ).data();
    return { ...user };
    // return { ...user };
  } catch (err) {
    throw new CustomError(
      err?.message || err?.code || "Could not get User",
      500
    );
  }
};

//Delete Accpunt
export const deleteUser = async function (uid, storeId) {
  getAuth()
    .deleteUser(uid)
    .then(() => {
      //Remove from user db
      getFirestore().collection("users/").doc(`${uid}`).delete();
    })
    .then(() => {
      //Remove from order
      getFirestore().collection("orders/").doc(`${uid}`).delete();
    })
    .then(() => {
      //Remove from customer
      getFirestore().collection("customer/").doc(`${uid}`).delete();
    })
    .then(() => {
      //delete store merchant
      getFirestore().collection("store/").doc(`${storeId}`).delete();
    })
    .then(() => {
      //delete logo(userId) and product(storeId)
      getFirestore().collection("store/").doc(`${storeId}`).delete();
    })
    .then(() => {
      //delete store product
      getFirestore().collection("store/").doc(`${storeId}`).delete();
    })
    .catch((e) => {
      throw CustomError(e?.message, 500);
    });
};
