import { getFirestore } from "firebase-admin/firestore";
import CustomError from "../../utils/error.js";
import { GetRecipientCode } from "../paystack/receipient.js";

//create recipent
export const addAccountUserDb = async function (uid, data) {
  //We only need the account
  const { account_name, bank_code, account_number } = data;

  try {
    //Get User Link
    const { link } = await getFirestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((d) => d.data());

    //Get Business Name
    const { businessName } = await getFirestore()
      .collection("store")
      .doc(link)
      .get()
      .then((d) => d.data());

    //Create transfer Receipient
    const receipient = await GetRecipientCode(
      uid,
      {
        store: businessName,
        link,
      },
      {
        bank_code,
        account_number,
        name: account_name, //Get this!
      }
    );

    //  Store in Firebase;
    return await getFirestore()
      .collection("users/")
      .doc(`${uid}`)
      .update({
        account: {
          receipientId: receipient?.id,
          receipientCode: receipient?.recipient_code,
          bankName: receipient?.details?.bank_name,
          accountName: receipient?.details?.account_name,
          accountNumber: receipient?.details?.account_number,
          createdOn: receipient?.createdAt,
        },
      })
      .then(() => "Successfully Added Bank Info");
  } catch (err) {
    throw new CustomError(
      err?.message || err?.code || "Could not add bank detail"
    );
  }
};
