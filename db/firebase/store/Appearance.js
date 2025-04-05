import { getFirestore } from "firebase-admin/firestore";
import CustomError from "../../../utils/error.js";

//Customize
export const getStoreCustomizationInfo = async (link) => {
  const merchantDocPath = getFirestore().collection("store/").doc(`${link}`);
  try {
    const getMerchantCustomSeting = getFirestore().runTransaction(
      async (transaction) => {
        const merchantDoc = await transaction.get(merchantDocPath);

        //Check If The Store exist
        if (!merchantDoc.exists) {
          throw new CustomError("Your store is not yet created!");
        }

        const appearance = merchantDoc.data()?.appearance;
        // { mobile: '1-col', desktop: '3-cols'}
        return appearance;
      }
    );
    return getMerchantCustomSeting;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const updateStoreCustomizationInfo = async (link, data) => {
  const merchantDocPath = getFirestore().collection("store/").doc(`${link}`);
  try {
    const setMerchantCustomSetting = getFirestore().runTransaction(
      async (transaction) => {
        const merchantDoc = await transaction.get(merchantDocPath);

        //Check If The Store exist
        if (!merchantDoc.exists) {
          throw new CustomError("Your store is not yet created!");
        }

        transaction.update(merchantDocPath, { appearance: data });

        return { message: "Preference saved!" };
      }
    );
    return setMerchantCustomSetting;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};
