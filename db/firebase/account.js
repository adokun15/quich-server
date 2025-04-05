import { getFirestore } from "firebase-admin/firestore";
import CustomError from "../../utils/error.js";
import { GetRecipientCode } from "../paystack/receipient.js";

export const addAccountUserDb = async function (uid, data) {
  //We only need the account na
  const { business_name, bank_code, account_number } = data;

  try {
    //Create transfer Receipient
    const receipient = await GetRecipientCode(uid, business_name, {
      bank_code,
      account_number,
      name: "", //Get this!
    });

    //  Store in Firebase;
    return await getFirestore()
      .collection("users/")
      .doc(`${uid}`)
      .update({
        account: {
          receipientId: receipient?.id,
          receipientCode: receipient?.receipient_code,
          bankName: receipient?.details?.bank_name,
          accountName: receipient?.details?.account_name,
          accountNumber: receipient?.details?.account_number,
          createdOn: receipient?.createdAt,
        },
      })
      .then(() => "Successfully Added Bank Info!");
  } catch (err) {
    throw new CustomError(
      err?.message || err?.code || "Could not add bank detail"
    );
  }
};
