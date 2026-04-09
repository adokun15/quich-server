//Manaul Deletion
//cREATE sTORE
//uPDate Store

//View: Joined Table: Store, Merchant, products;
//For new request: Track visitor;

import {
  CreateMerchantforDb,
  getMerchantFromDb,
} from "../repository/merchants.js";
import { getProducts } from "../repository/products.js";
import {
  CreateMerchantStoreDB,
  GetMerchantStoreDetail,
  UpdateMerchantStoreDB,
} from "../repository/stores.js";
import DatabaseError from "../utils/error/DatabaseError.js";
import CustomError from "../utils/error/error.js";
import { getMerchantInfo } from "./users.js";

//Store front products
export const getAllStoreProducts = async function ({ store_id, filter }) {
  const products = await getProducts({
    ...filter,
    store_id,
  });
  return products;
};

//Create Store With data collected from store
export const createMerchantStore = async ({ phone, data }) => {
  //Collect final payload from whatsapp flow;
  try {
    //Get merchant id by phone;
    const merchant = await getMerchantInfo(phone);

    if (!merchant) {
      throw DatabaseError("Merchant not found");
    }

    //Create a store for a merchant;
    const res = await CreateMerchantStoreDB([
      merchant.merchant_id,
      data.category,
      data.name,
      data.slug,
    ]);

    return res;
  } catch {
    throw new CustomError("Merchant not found");
  }
};

//Store Front Access
export const getUserStore = async ({ store_id_slug = "" }) => {
  const storeData = await GetMerchantStoreDetail(store_id_slug);

  // Please fix this : add publish toggle;

  /*      if (
        storeData &&
        !storeData.published &&
        storeData.merchant?.id !== merchant_id
      ) {
        throw new CustomError(
          "THIS STORE IS CURRENTLY OFFLINE. COME BACK LATER!",
        );
      }
      */

  return storeData;
};

export const updateUserStore = async (store_id, updates) => {
  try {
    const data = await UpdateMerchantStoreDB({ updates, store_id }); //fIX THIS
    return { message: "Store Updated!", data };
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }
};

export default getAllStoreProducts;
