import { getFirestore } from "firebase-admin/firestore";
import CustomError from "../../../utils/error.js";

//  DELIVERY
export const getStoreDeliveryFee = async (link) => {
  const merchantDocPath = getFirestore().collection("store/").doc(`${link}`);
  try {
    const getDeliveryFeeList = getFirestore().runTransaction(
      async (transaction) => {
        const merchantDoc = await transaction.get(merchantDocPath);

        //Check If The Store exist
        if (!merchantDoc.exists) {
          throw new CustomError("Your store is not yet created!");
        }

        const delivery = merchantDoc.data()?.deliveryFeeInfo || [];

        return delivery;
      }
    );
    return getDeliveryFeeList;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const AddToStoreDeliveryFee = async (link, data) => {
  const merchantDocPath = getFirestore().collection("store/").doc(`${link}`);
  try {
    const getMerchant = getFirestore().runTransaction(async (transaction) => {
      const merchantDoc = await transaction.get(merchantDocPath);

      //Check If The Store exist
      if (!merchantDoc.exists) {
        throw new CustomError("Your store is not yet created!");
      }

      const delivery = merchantDoc.data()?.deliveryFeeInfo || [];

      transaction.update(merchantDocPath, {
        deliveryFeeInfo: [data, ...delivery],
      });
      return { message: "success" };
    });
    return getMerchant;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};
export const UpdateSingleStoreDeliveryFee = async (link, data) => {
  const merchantDocPath = getFirestore().collection("store/").doc(`${link}`);
  try {
    const UpdateProcessForDelivery = getFirestore().runTransaction(
      async (transaction) => {
        const merchantDoc = await transaction.get(merchantDocPath);
        //Check If The Store exist
        if (!merchantDoc.exists) {
          throw new CustomError("Your store is not yet created!");
        }

        //Find Id And Update DELIVERY iNFO
        const newList = merchantDoc.data()?.deliveryFeeInfo?.map((delivery) => {
          if (delivery?.id === data?.id) {
            return data;
          } else {
            return delivery;
          }
        });

        transaction.update(merchantDocPath, {
          deliveryFeeInfo: newList,
        });
        return { message: "success" };
      }
    );
    return UpdateProcessForDelivery;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const DeleteSingleStoreDeliveryFee = async (link, deliveryFeeId) => {
  const merchantDocPath = getFirestore().collection("store").doc(`${link}`);
  try {
    const DeletionProcessForDelivery = getFirestore().runTransaction(
      async (transaction) => {
        const merchantDoc = await transaction.get(merchantDocPath);

        //Check If The Store exist
        if (!merchantDoc.exists) {
          throw new CustomError("Your store is not yet created!");
        }

        //Find Id And Update DELIVERY iNFO
        const newData = merchantDoc
          .data()
          ?.deliveryFeeInfo?.filter((delivery) => {
            delivery?.id !== deliveryFeeId;
          });

        transaction.update(merchantDocPath, { deliveryFeeInfo: newData });
        return { message: "Location removed from list" };
      }
    );
    return DeletionProcessForDelivery;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};
