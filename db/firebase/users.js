import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import generateUniqueId from "generate-unique-id";
import CustomError from "../../utils/error.js";

// Get
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

  await getFirestore().collection("users/").doc(`${currentUser.uid}`).update({
    userId: currentUser.uid,
    account: {}, //No bank info
    link: "", //No store: no whatapp, order, customer
  });

  return getAuth()
    .setCustomUserClaims(currentUser.uid, {
      role: "free-trial",
      expiresIn: date.toISOString(),
    })
    .then(() => "Your Email Has been successfully Verified. Login To Continue!")
    .catch((e) => {
      console.log(e);
      throw new CustomError(e?.errorInfo?.code || "Email verification failed");
    });
};

export const verifyToken = async function (token) {
  try {
    //  const { token } = req.params;
    //Verify Token
    const decodedToken = await getAuth().verifyIdToken(token); //uid, email

    //get uid from
    const uid = decodedToken.uid;

    const user = await getAuth().getUser(uid);
    return user;
  } catch (err) {
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
      throw new CustomError(err?.errorInfo?.code || "Could not Authenticate!");
    }
  }
};

//Generate Store Link
export const GenerateStoreLink = function () {
  return generateUniqueId({
    length: 16,
    excludeSymbols: ["@", "#", "$", "%", "^", "&", "*", "!"],
  });
};

//Get user Db
export const getUserDb = async function (uid) {
  try {
    const user = (
      await getFirestore().collection("users/").doc(`${uid}`).get()
    ).data();
    return { ...user };
  } catch (err) {
    throw new CustomError(
      err?.message || err?.code || "Could not get User",
      500
    );
  }
};
