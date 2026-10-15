import {
  createMerchantFromWhatsapp,
  getMerchantInfo,
} from "../services/users.js";
import CustomError from "../utils/error/error.js";
import { CreateMerchantToken } from "../utils/jwt/signToken.js";
import { VerifyMerchantToken } from "../utils/jwt/VerifyToken.js";

//Update Progress, update data
export const onBoardController = async (req, res, next) => {
  try {
    const { progress } = req.params;
    const { data } = req.body;
    const { userId, email } = req.user;

    if (isNaN(progress)) {
      throw new CustomError("Invalid parameter value for progress!", 400);
    }

    //step 1: personal update;
    if (Number(progress) === 1) {
      //Create Merchant Profile;
      const { name, phone, otp } = data;

      //Check Otp First;
      /* Does it match with the other one*/
      /* Does this number exist in the db before*/

      /* Then proceed to o create merchant account */

      //Create Mercahnt;
      await createMerchantFromWhatsapp({
        user: {
          name,
          phone: phone, //
          email,
          merchant_id: userId,
        },
      });

      //Update next:progress
    }

    //Step 2: Store setup,
    if (Number(progress) === 2) {
      //Create Store Details; With Store Logo
      const { store_slug, store_name, category } = data;

      //Validate Input;

      //Create Mercahnt;
      await createMerchantFromWhatsapp({
        store_slug,
        store_name,
        category,
      });

      //Update next:progress
    }

    //Step 2: Referal code: How do you know about us?, Referral code
    if (Number(progress) === 3) {
      //Referred by
      const { referredVia, referral_code } = data;

      //Create referal on merchant

      //Update Refrealled owner!

      //Update next:progress
    }

    //pick plan:
    if (Number(progress) === 4) {
      const { plan } = data;

      //Update Progress and mark onboard as completed!
      await createMerchantFromWhatsapp({});

      if (!plan) {
        res.json({});
      }

      //Redirect to paystack!
    }
  } catch (e) {
    next(e);
  }
};

//Token validaton endpoint only!
export const authController = async (req, res, next) => {
  try {
    const token = req.get("Authorization").split(" ")[1];

    //Verify
    const data = await VerifyMerchantToken(token); //{userId, email}

    //onboarded? (json)
    const merchant = await getMerchantInfo(
      "a4491c08-43f0-4edb-b478-2ba75de90549",
    ); //Use Id Instead

    if (data && !merchant) {
      // Valid token but no merchant
      throw new CustomError("no_account_yet");
    }

    if (!data && !merchant) {
      // Invalid token and no merchant
      throw new CustomError("Account not found!", 404);
    }

    //return data
    res.json({
      data: {
        registration_completed: merchant?.reg_completed,
        current_step: merchant?.reg_current_step,
        store_slug: merchant?.store_id,
        store_id: merchant?.store_slug,
      },
      status: true,
    });
  } catch (e) {
    //userid, email

    if (e.code === "ERR_JWT_EXPIRED") {
      throw new CustomError("Session timed-out", 401);
    }

    if (e.message === "fetch failed") {
      throw new CustomError("Network failed! ", 500);
    }

    if (e.code === "ERR_JWKS_TIMEOUT") {
      throw new CustomError("Network failed! ", 500);
    }

    if (e.code === "ERR_JWS_INVALID") {
      throw new CustomError("Invalid token received! ", 404);
    }

    if (e.message === "no_account_yet") {
      throw new CustomError("no_account_yet", 404);
    }

    next(e);
  }
};

/*
export const RequestOtpController = async (req, res, next) => {};

export const VerifyOtpController = async (req, res, next) => {};

export const VerifyLoginTokenController = async (req, res, next) => {};
*/
