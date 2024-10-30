import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import generateUniqueId from "generate-unique-id";

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
    throw new Error("Could not authenticate!");
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
  return await getFirestore().collection("users/").doc(`${uid}`).set({ link });
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
    console.log(err);
    throw new Error(err?.code || "Could not upload details!");
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
    throw new Error(err?.code || "Could not get User");
  }
};
