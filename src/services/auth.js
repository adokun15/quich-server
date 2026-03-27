import {
  CreateLoginToken,
  CreateOtp,
  GetLoginToken,
  GetOtpCode,
  UpdateLoginToken,
  UpdateOtpCode,
} from "../repository/auth";
import { getMerchantFromDb } from "../repository/merchants";
import CustomError from "../utils/error/error";
import { CreateMerchantToken } from "../utils/jwt/signToken";
import { sendPhoneNumberVerificationCode } from "../utils/whatsapp/outgoing/message/templates/verification";

//Request From Browser
export async function RequestOtp({ phone }) {
  //Fetch user from merchant table;
  try {
    const merchant = await getMerchantFromDb(phone);

    if (!merchant) {
      throw new Error("Account not found!");
    }

    //Generate a 6-digit otp
    const otp_code = "12456";

    //Hash otp
    const hashed_code = "asdasdasdasda";

    //Save Hashed to DB
    await CreateOtp({ phone, code: hashed_code });

    //Send actual code to whatsapp
    await sendPhoneNumberVerificationCode(phone, otp_code);

    return {
      mesaage: "Verification Code has been sent to your whatsapp number",
    };
  } catch (e) {
    throw new CustomError(e?.message);
  }
}

//Validate
export async function VerifyOtpCode({ otp = "", phone }) {
  try {
    //Fetch user from merchant table;
    const merchant = await getMerchantFromDb(phone);

    //Does Merchant Exist;
    if (!merchant) {
      throw new Error("Account not found!");
    }

    //Hash the new otp
    const request_otp = "hashed" + otp;

    //Get the data from db
    const { hashed_otp, used } = await GetOtpCode({ phone });

    if (!hashed_otp || request_otp !== hashed_otp || used) {
      throw new CustomError("Invalid or Expired Otp");
    }

    //Update Otp Db
    await UpdateOtpCode({ used: true, identifier: phone });

    //Generate a Jwt Token
    const token = CreateMerchantToken(
      {
        merchantId: merchant?.id,
        storeId: merchant?.store_id,
        phone: merchant?.phone,
      },
      "1d",
    );
    return { token };
  } catch (e) {
    throw new CustomError(e?.message);
  }
}

//Request From Whatsapp
export async function GenerateLoginToken({ phone }) {
  //Fetch user from merchant table;
  try {
    const merchant = await getMerchantFromDb(phone);

    if (!merchant) {
      throw new Error("Account not found!");
    }

    //Generate a one time token usage
    const temp_token = "12456";

    //Save token to db
    const token = await CreateLoginToken({
      identifier: phone,
      token: temp_token,
    });

    return { token };
  } catch (e) {
    throw new CustomError(e?.message);
  }
}

//Validate whatsapp token
export async function ValidateLoginToken({ token }) {
  try {
    const fetchedtoken = await GetLoginToken({ token });

    if (!fetchedtoken || fetchedtoken?.token_data?.used) {
      throw new CustomError("Invalid request or expired token!");
    }

    //Then Mark token as used
    await UpdateLoginToken({ used: true, identifier: phone });

    //Generate a Jwt Token
    const token = CreateMerchantToken({
      merchantId: merchant?.id,
      storeId: merchant?.store_id,
      phone: merchant?.phone,
    });
    return { token };
  } catch (e) {
    throw new CustomError(e?.message);
  }
}
