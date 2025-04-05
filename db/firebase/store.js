import { getFirestore } from "firebase-admin/firestore";
import CustomError from "../../utils/error.js";

const getAllStoreProducts = async function (link) {
  try {
    const ref = getFirestore().collection(`store/${link}/products`);
    //Run tansaction
    const products = await getFirestore().runTransaction(
      async (transaction) => {
        const productsDoc = await transaction.get(ref);

        if (productsDoc.empty) {
          throw new CustomError("This store has no Product Available!");
        }

        let list = [];
        productsDoc.forEach((product) => {
          if (product.data()?.published) {
            list.push({ ...product.data(), productId: product.id });
          }
        });

        return list;
      }
    );

    return products;
  } catch (e) {
    throw new CustomError(
      e?.message || e?.code || "SOMETHING WENT WRONG!",
      500
    );
  }
};

//Initalize store only and not user db;
export const createUserStore = async (link, uid, data) => {
  try {
    await getFirestore().collection("users/").doc(`${uid}`).update({ link });

    await getFirestore().collection("store/").doc(`${link}`).set({
      userId: uid,
      businessName: data?.business_name,
      status: data?.business_status,
      description: data?.business_desc,
      category: data?.business_category,
      phone: "",
    });

    return { message: "Success. Merchant details saved" };
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const getUserStore = async (link, uid = "") => {
  const merchantDocPath = getFirestore().collection("store/").doc(`${link}`);
  try {
    const getMerchant = getFirestore().runTransaction(async (transaction) => {
      const merchantDoc = await transaction.get(merchantDocPath);

      if (!merchantDoc.exists) {
        throw new CustomError(
          "THIS STORE DOES NOT EXIST. CHECK THE LINK AND TRY AGAIN!"
        );
      }

      if (
        merchantDoc.exists &&
        !merchantDoc?.data()?.published &&
        merchantDoc?.data()?.userId !== uid
      ) {
        throw new CustomError(
          "THIS STORE IS CURRENTLY OFFLINE. COME BACK LATER!"
        );
      }

      return merchantDoc.data();
    });
    return getMerchant;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const updateUserStore = async (link, data) => {
  try {
    await getFirestore().collection("store/").doc(`${link}`).update(data);
    return { message: "Merchant details Updated!" };
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export default getAllStoreProducts;
