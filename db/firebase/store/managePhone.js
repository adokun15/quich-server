import { getFirestore } from "firebase-admin/firestore";
import CustomError from "../../../utils/error.js";
import { sendPhoneNumberVerificationCode } from "../../whatapp/templates/verification.js";
//Process Whatsapp verification
export const sendCodeToDestinateUser = async (link, phonenumber) => {
  try {
    //Get Link

    const merchantPath = getFirestore().collection("store").doc(`${link}`);

    return await getFirestore().runTransaction(async (transaction) => {
      const merchantDoc = await transaction.get(merchantPath);

      //Does merchant exist!
      if (!merchantDoc.exists) {
        throw new CustomError("This merchant does not Exist!", 404);
      }

      //Does merchant have a phone number before!
      if (merchantDoc.data().phone) {
        throw new CustomError(
          "Error. This Account has been linked to a phone number already!",
          500,
        );
      }

      //Get Code sent to user...
      const codeFromWhatApp =
        await sendPhoneNumberVerificationCode(phonenumber);

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
      return {
        message: `Verification code has been sent to +234${phonenumber}`,
      };
    });
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
          "Verification code not sent Initially. Contact support for more assistance!",
          500,
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
          401,
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
