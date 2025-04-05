import { getFirestore } from "firebase-admin/firestore";
import CustomError from "../../../utils/error.js";

//Shipping Setting
export const getStoreShippingInformation = async (link) => {
  const merchantDocPath = getFirestore().collection("store/").doc(`${link}`);
  try {
    const getMerchantShippingInfo = getFirestore().runTransaction(
      async (transaction) => {
        const merchantDoc = await transaction.get(merchantDocPath);
        //Check If The Store exist
        if (!merchantDoc.exists) {
          throw new CustomError("Your store is not yet created!");
        }

        return merchantDoc.data()?.shippingOption || {};
      }
    );
    return getMerchantShippingInfo;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const updateStoreShippingInformation = async (link, info) => {
  const merchantDocPath = getFirestore().collection("store/").doc(`${link}`);
  try {
    const updateShipping = getFirestore().runTransaction(
      async (transaction) => {
        const merchantDoc = await transaction.get(merchantDocPath);

        //Check If The Store exist
        if (!merchantDoc.exists) {
          throw new CustomError("Your store is not yet created!");
        }

        transaction.update(merchantDocPath, {
          shippingOption: info,
        });
        return { message: "Shipping Info updated!" };
      }
    );
    return updateShipping;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};
