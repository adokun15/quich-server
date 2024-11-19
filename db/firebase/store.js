import { getFirestore } from "firebase-admin/firestore";
import CustomError from "../../utils/error.js";
import { sendPhoneNumberVerificationCode } from "../whatapp/verification.js";

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
    console.log(e);
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

//Process Whatsapp verification
export const sendCodeToDestinateUser = async (link, phonenumber) => {
  try {
    const merchantPath = getFirestore().collection("store").doc(`${link}`);

    await getFirestore().runTransaction(async (transaction) => {
      const merchantDoc = await transaction.get(merchantPath);

      //Does merchant exist!
      if (!merchantDoc.exists) {
        throw new CustomError("This merchant does not Exist!", 404);
      }

      //Does merchant have a phone number before!
      if (merchantDoc.data().phone) {
        throw new CustomError(
          "Error. This Account has been linked to a phone number already!",
          500
        );
      }

      //Get Code sent to user...
      const codeFromWhatApp = await sendPhoneNumberVerificationCode(
        phonenumber
      );

      //Set 10minutes expiration time
      const expiration_date = new Date();

      const next10Min = 10 * 60 * 1000;

      expiration_date.setMilliseconds(next10Min);

      //Update db for verification code
      transaction.update(merchantPath, {
        code: {
          num: codeFromWhatApp,
          expiresIn: expiration_date.toISOString(),
          phone: phonenumber,
        },
      });
    });
    return { message: `Verification code has been sent to +234${phonenumber}` };
  } catch (e) {
    console.log(e);
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export const VerifyCodeFromDestinateUser = async (link, verification_code) => {
  try {
    const merchantPath = getFirestore().collection("store").doc(`${link}`);

    await getFirestore().runTransaction(async (transaction) => {
      const merchantDoc = await transaction.get(merchantPath);

      //Does merchant exist!
      if (!merchantDoc.exists) {
        throw new CustomError("This merchant does not Exist!", 404);
      }

      //Does not have Code Before
      if (!merchantDoc.data()?.code) {
        throw new CustomError(
          "Verification code not sent Initially!. Contact support for more assistance!",
          500
        );
      }

      //The code object!
      const code = merchantDoc.data()?.code;

      //Check timer
      const now = new Date();
      const expiration_date = new Date(code?.expiresIn);

      //Use 401 to allow user retry
      if (now.getTime() >= expiration_date.getTime()) {
        throw new CustomError(
          "Verification code is no longer valid!. Request for new Verification code!",
          401
        );
      }

      //Wrong code
      if (code?.num !== verification_code) {
        throw new CustomError("Verification code is invalid", 500);
      }

      //nullify code object
      transaction.update(merchantPath, { phone: code?.phone });

      //Update db for phone number
      transaction.update(merchantPath, { code: null });
    });
    return { message: `Your Number has been successfully added.` };
  } catch (e) {
    console.log(e);
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};
