import { paystack } from "../../utils/paystack.js";

//Send money Asap
export const MakeTransferToRecipient = async function (receipientCode, amount) {
  if (!receipientCode) {
    throw new CustomError("Invalid Request!", 400);
  }

  const config = {
    method: "POST",
    endpoint: `/transfer`,
  };

  const data = {
    source: "balance",
    amount,
    recipient: receipientCode,
  };

  const info = await paystack(config, data);

  //TransferCode
  return info?.data || "Could not transfer money!";
};

//eXAMINE lATER
export const DeleteRecipient = async function (receipientCode) {
  if (!receipientCode) {
    throw new CustomError("Invalid Request!", 400);
  }

  const config = {
    method: "DELETE",
    endpoint: `/transferrecipient/${receipientCode}`,
  };

  ///const info = await paystack(config);

  // return info?.data || "Transfer receipient could not be deleted!";
};

export const GetRecipientCode = async function (
  uid,
  business_name,
  { name, account_number, bank_code }
) {
  if (!name || !account_number || !bank_code) {
    throw new CustomError("Invalid Request!", 400);
  }

  const config = {
    method: "POST",
    endpoint: "/transferrecipient",
  };

  const data = {
    type: "nuban",
    name: name,
    account_number,
    bank_code,
    currency: "NGN",
    metadata: {
      uid,
      store_name: business_name,
    },
  };

  const info = await paystack(config, data);

  return info?.data || "No transfer receipient generated!";
};
