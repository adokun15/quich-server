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
    const otp_code = Math.trunc(Math.random() * 6);

    //Hash otp
    //const hashed_code =

    //Save OTP to DB
    await CreateOtp({ phone, code: otp_code });

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
export async function VerifyOtpCode({ request_otp = "", phone }) {
  try {
    //Fetch user from merchant table;
    const merchant = await getMerchantFromDb(phone);

    //Does Merchant Exist;
    if (!merchant) {
      throw new Error("Account not found!");
    }

    //Hash the new otp
    //const request_otp = "hashed" + otp;

    //Get the data from db
    const { otp, used } = await GetOtpCode({ phone });

    if (!otp || Number(request_otp) !== Number(otp) || used) {
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
    const temp_token = Math.trunc(Math.random() * 6);

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
    const fetchedtoken = await GetLoginToken({ token: token });

    if (!fetchedtoken || fetchedtoken?.token_data?.used) {
      throw new CustomError("Invalid request or expired token!");
    }

    //Then Mark token as used
    await UpdateLoginToken({ used: true, identifier: phone });

    //Generate a Jwt Token
    const gen_token = CreateMerchantToken({
      merchantId: merchant?.id,
      storeId: merchant?.store_id,
      phone: merchant?.phone,
    });
    return { token: gen_token };
  } catch (e) {
    throw new CustomError(e?.message);
  }
}
