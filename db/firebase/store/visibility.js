import { getFirestore } from "firebase-admin/firestore";
import CustomError from "../../../utils/error.js";

export const getMerchantVisibility = async (link) => {
  try {
    const merchantPath = getFirestore().collection("store").doc(`${link}`);

    const state = await getFirestore().runTransaction(async (transaction) => {
      const merchantDoc = await transaction.get(merchantPath);

      if (!merchantDoc.exists) {
        throw new Error("Merchant does not Exist!");
      }

      return merchantDoc.data().published;
    });
    return state;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const updateMerchantVisibility = async (link) => {
  try {
    const merchantPath = getFirestore().collection("store").doc(`${link}`);

    await getFirestore().runTransaction(async (transaction) => {
      const merchantDoc = await transaction.get(merchantPath);

      if (!merchantDoc.exists) {
        throw new Error("Merchant does not Exist!");
      }

      const prevState = merchantDoc.data().published;

      transaction.update(merchantPath, { published: !prevState });
    });
    return { message: prevState ? "Store is offline" : "Store is Online" };
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};
