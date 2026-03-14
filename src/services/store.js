//Manaul Deletion
//cREATE sTORE
//uPDate Store

//View: Joined Table: Store, Merchant, products;
//For new request: Track visitor;

import pool from "../utils/database/db.js";
import CustomError from "../utils/error/error.js";

const getAllStoreProducts = async function (link) {
  try {
    const res = await pool.query(
      "SELECT * from customers Where customer_id = $1",
      [link],
    );

    console.log(res);
    return { time_of_request: res?.rows };
  } catch (e) {
    console.log(e);
    throw CustomError(e);
  }
};

export const createMerchantStore = async (uid, data) => {
  //Collect final payload from whatsapp flow;
  //Create a store for a merchant;
};

export const getUserStore = async (link, uid = "") => {
  /*
  const merchantDocPath = getFirestore().collection("store/").doc(`${link}`);
  try {
    const getMerchant = getFirestore().runTransaction(async (transaction) => {
      const merchantDoc = await transaction.get(merchantDocPath);

      if (!merchantDoc.exists) {
        throw new CustomError(
          "THIS STORE DOES NOT EXIST. CHECK THE LINK AND TRY AGAIN!",
        );
      }

      if (
        merchantDoc.exists &&
        !merchantDoc?.data()?.published &&
        merchantDoc?.data()?.userId !== uid
      ) {
        throw new CustomError(
          "THIS STORE IS CURRENTLY OFFLINE. COME BACK LATER!",
        );
      }

      return merchantDoc.data();
    });
    return getMerchant;
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
*/
};

export const updateUserStore = async (link, data) => {
  /*
  try {
    await getFirestore().collection("store/").doc(`${link}`).update(data);
    return { message: "Merchant details Updated!" };
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
    */
};

export default getAllStoreProducts;
