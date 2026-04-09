import {
  CreateMerchantforDb,
  DeleteMerchantFromDb,
  getMerchantFromDb,
  UpdateMerchantFromDb,
} from "../repository/merchants.js";
import DatabaseError from "../utils/error/DatabaseError.js";
import CustomError from "../utils/error/error.js";
import { WhatsappTextMessage } from "../utils/whatsapp/outgoing/message/textmessage.js";
import { CancelSubscription } from "./subscription.js";

//Create merchant; after validating their email;
export async function createMerchantFromWhatsapp({ user }) {
  try {
    const merchant = await CreateMerchantforDb({
      name: user?.id,
      email: user?.store_id,
      phone: user?.phone,
    });
    return merchant;
  } catch (e) {
    throw new DatabaseError(e?.message);
  }
}

//Get user Db
export const getMerchantInfo = async function (identifier) {
  try {
    const merchant = await getMerchantFromDb(identifier);
    return merchant;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

//Update user Db
export const UpdateMerchantInfo = async function ({ updates, merchant_id }) {
  try {
    const merchant = await UpdateMerchantFromDb({ updates, merchant_id }); //Fix this!!

    //Return new Data
    return merchant;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

//Delete Merchant Accpunt
export const deleteMerchantAccount = async function ({ merchant_id, phone }) {
  try {
    //Delete & Deactivate merchant account
    await DeleteMerchantFromDb(merchant_id);

    //Cancel subscription
    await CancelSubscription(merchant_id);

    //Send a farewaell message to whatsapp;
    await WhatsappTextMessage(
      phone,
      "Your account has been deleted, Thank you for using our service.",
    );

    return { message: "Account deleted." };
  } catch (e) {
    throw new CustomError(e?.message, 500);
  }
};
