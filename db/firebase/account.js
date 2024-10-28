import { getFirestore } from "firebase-admin/firestore";
import { GetSplitCode, GetSubAccount } from "../paystack/subaccount.js";

export const addAccountUserDb = async function (uid, data) {
  const { business_name, bank_code, account_number } = data;
  try {
    // Generate SubAcccount function
    const subaccountDetail = await GetSubAccount({
      business_name,
      bank_code,
      account_number,
    });

    // Generate Split Code function
    const splitDetail = await GetSplitCode(
      subaccountDetail?.account_name,
      subaccountDetail?.subaccount_code
    );

    //  Store in Firebase;
    return await getFirestore()
      .collection("users/")
      .doc(`${uid}`)
      .update({
        account: {
          subaccountId: subaccountDetail?.id,
          bankName: subaccountDetail?.settlement_bank,
          accountName: subaccountDetail?.account_name,
          accountNumber: subaccountDetail?.account_number,
          subaccountCode: subaccountDetail?.subaccount_code,
          createdOn: subaccountDetail?.createdAt,
        },
        splitCode: splitDetail?.split_code,
      })
      .then(() => "Successfully Added Bank Info!");
  } catch (err) {
    throw new Error(
      err?.message || err?.details || err?.code || "Could not add bank detail"
    );
  }
};
