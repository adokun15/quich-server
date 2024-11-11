import { getFirestore } from "firebase-admin/firestore";
import { createUserDb } from "./users.js";
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
          console.log(product.data());
          if (product.data()?.published) {
            list.push({ ...product.data(), productId: product.id });
          }
        });

        return list;
      }
    );

    return products;
  } catch (e) {
    console.log(e);
    throw new CustomError(
      e?.message || e?.code || "SOMETHING WENT WRONG!",
      500
    );
  }
};

//Initalize store and user Db;
export const createUserStore = async (link, uid, data) => {
  try {
    await getFirestore().collection("store/").doc(`${link}`).set({
      userId: uid,
      businessName: data?.business_name,
      phone: data?.business_number,
      description: data?.business_desc,
      category: data?.business_category,
    });
    await createUserDb(uid);
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
    return { message: "Success. Merchant details Updated" };
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
    return { message: "Store Updated!" };
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export default getAllStoreProducts;
