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
    res.json({
      email: user?.email,
      //businessName: user?.displayName,
      uid: user.uid,
      ...user,
    });
  } catch (err) {
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
  return await getFirestore()
    .collection("users/")
    .doc(`${uid}`)
    .update({ link });
};

//Create user Db Business
export const createUserDb = async function (uid, data) {
  try {
    await getFirestore().collection("users/").doc(`${uid}`).set({
      userId: uid,
      businessName: data?.business_name,
      businessNumber: data?.business_number,
      businessDescription: data?.business_desc,
      businessCategory: data?.business_category,
      account: {},
      link: "",
      logo: "",
      role: "",
    });
    return { message: "Success. Business details saved" };
  } catch (err) {
    throw new Error(err?.code || "Could not upload details!");
  }
};
