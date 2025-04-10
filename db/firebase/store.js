import { getFirestore } from "firebase-admin/firestore";
import { Customer } from "../paystack/customer.js";
import CustomError from "../../utils/error.js";
import { getAuth } from "firebase-admin/auth";
import generateUniqueId from "generate-unique-id";

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
export const createUserStore = async (uid, data) => {
  try {
    //get email, display name from getAuth
    const { email, display_name } = await getAuth().getUser(uid);

    const { customerCode } = await Customer({
      name: display_name || "",
      email,
    });

    //Generate some Store Link
    const linkGenerated = generateUniqueId({
      length: 6,
      useLetters: false,
      excludeSymbols: ["@", "#", "$", "%", "^", "&", "*", "!"],
    });

    const linkName =
      data?.business_name
        ?.split(" ")
        .map((n) => n)
        .join("-") + `-${linkGenerated}`;

    //Collect first name, last name, storelink, store name, store description, store industry (Category)
    await getFirestore().collection("users").doc(`${uid}`).update({
      link: linkName,
      customer_code: customerCode,
    });

    await getFirestore().collection("store/").doc(`${linkName}`).set({
      userId: uid,
      businessName: data?.business_name,
      description: data?.business_desc,
      industry: data?.business_category,
      phone: "",
      status: "Store Unverified",
    });

    return {
      message: `Success. store link generated (${linkName})`,
      link: linkName,
    };
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
