import { getFirestore } from "firebase-admin/firestore";
import { createUserDb } from "./users.js";

export default async function getAllStoreProduct(link) {
  const ref = getFirestore().collection(`store/${link}/products`);
  let products = [];
  await ref
    .get()
    .then((data) => {
      data.forEach((product) => {
        if (product.exists) {
          products.push({ ...product.data(), productId: product.id });
        } else {
          throw "Store has no product";
        }
      });
    })
    .catch((err) => console.log(err));

  return { store: products };
}
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
    return { message: "Success. Business details saved" };
  } catch (err) {
    console.log(err);
    throw new Error(err?.code || "Could not upload details!");
  }
};

export const getUserStore = async (link) => {
  try {
    const storeUser = (
      await getFirestore().collection("store/").doc(`${link}`).get()
    ).data();
    return { ...storeUser };
  } catch (err) {
    throw new Error(err?.code || "Could not get User store details");
  }
};

export const updateUserStore = async (link, data) => {
  try {
    await getFirestore().collection("store/").doc(`${link}`).update(data);
    return { message: "Success. Business details Updated" };
  } catch (err) {
    throw new Error(err?.code || "Could not update details!");
  }
};

export const updateMerchantVisibility = async (link) => {
  try {
    console.log(link);
    //const merchantPath = db.collection("store").doc(`${link}`);
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
  } catch (err) {
    console.log(err);
    throw new Error(err?.code || "Could not update details!");
  }
};
