import CustomError from "../utils/error/error";

//cREATE TOKEN;
export function createMerchantToken() {
  // const token = jwt.sign(
  //{
  ///  userId: user.id,
  //  phone: user.phone_number,
  //role: user.role
  //},
  // process.env.JWT_SECRET,
  //{ expiresIn: "30mins" }
  //)
}

//Get user Db
export const getMerchantInfo = async function (merchant_id) {
  //merchant data only together
};

//Delete Merchant Accpunt
export const deleteMerchantAccount = async function (uid, storeId) {
  //Trigger webhook to stop subscription;
  //Remove account and foreign data too
  //Send a farewell message to user
};
