import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import generateUniqueId from "generate-unique-id";
import CustomError from "../../utils/error.js";

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

//save Store Link
export const saveStoreLink = async function (uid, link) {
  try {
    return await getFirestore()
      .collection("users/")
      .doc(`${uid}`)
      .set({ link });
  } catch (e) {
    throw new CustomError(
      err?.message || err?.code || "Could not add link",
      500
    );
  }
};

//Create user Db Business
export const createUserDb = async function (uid) {
  try {
    await getFirestore().collection("users/").doc(`${uid}`).update({
      userId: uid,
      account: {},
    });
    return { message: "Success. Business details saved" };
  } catch (err) {
    throw new CustomError(
      err?.message || err?.code || "Could not upload details!",
      500
    );
  }
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
