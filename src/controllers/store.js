import getAllStoreProducts, {
  getUserStore,
  updateUserStore,
} from "../services/store.js";
import CustomError from "../utils/error/error.js";

export const GetStoreController = async (req, res, next) => {
  const storeLink = req.params.storeSlug;

  //validate store_id
  /*
  const temp_model = {
    store_id: "demo-store-id",
    store_profile: null,
    store_bio: "Fruit mart at your doorstep, and this is going to be one those long ass text again",
    store_slug: "bland",
    store_video_ad: "",
    store_category: "SuperMarket & Retails",
    store_location: { verified: false, ip: "ip-address" },
    store_name: "Bland Fruit SuperMarket",
    merchant: {
      merchant_id: "demo-merchant-id",
      phone: "8129584035",
      profile: null,
      name: "Ohida!",
    },
  };
 */
  try {
    if (!storeLink) {
      throw new CustomError("Invalid Slug!");
    }

    const store = await getUserStore({ store_id_slug: storeLink });
    res.json({ data: store, status: true });
  } catch (e) {
    next(e);
  }
};

export const GetStoreProductsController = async (req, res, next) => {
  const store_id = req.params.storeId;

  try {
    //validate filter and store_id

    const store_product = await getAllStoreProducts({ store_id });

    res.json({
      data: store_product?.products,
      status: true,
    });
  } catch (e) {
    next(e);
  }
};

export const updateStoreController = async (req, res) => {
  //const store = req.params.store;

  if (!req.body) {
    //  throw new CustomError("No information provided.");
  }

  //if (!store) {
  // throw new CustomError("Invalid store link.");
  //}

  //const updateMerchant = await updateUserStore(store, req?.body);
  res.json(updateUserStore);
};
