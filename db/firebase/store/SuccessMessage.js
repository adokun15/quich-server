import { getFirestore } from "firebase-admin/firestore";
import CustomError from "../../../utils/error.js";

//Success Message
export const getStoreSuccessMessage = async (link) => {
  const merchantDocPath = getFirestore().collection("store/").doc(`${link}`);
  try {
    const getMerchantSuccessMessage = getFirestore().runTransaction(
      async (transaction) => {
        const merchantDoc = await transaction.get(merchantDocPath);
        //Check If The Store exist
        if (!merchantDoc.exists) {
          throw new CustomError("Your store is not yet created!");
        }

        //check if it belongs to the owner
        /* if (merchantDoc?.data()?.userId !== uid) {
        throw new CustomError(
          "You dont have access to this. Contact support for more information"
        );
      }
*/
        const storename = merchantDoc.data()?.businessName;

        return merchantDoc.data()?.success_message
          ? merchantDoc.data()?.success_message
          : `Thank you for shopping at ${storename}`;
      }
    );
    return getMerchantSuccessMessage;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const updateStoreSuccessMessage = async (link, message) => {
  try {
    const merchantPath = getFirestore().collection("store").doc(`${link}`);

    await getFirestore().runTransaction(async (transaction) => {
      const merchantDoc = await transaction.get(merchantPath);

      if (!merchantDoc.exists) {
        throw new CustomError(
          "Merchant Shop does not Exist. Contact support",
          404
        );
      }

      transaction.update(merchantPath, { success_message: message });
    });
    return { message: "Success Message Updated!" };
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};
