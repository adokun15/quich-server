import getAllStoreProducts, {
  getUserStore,
  updateUserStore,
} from "../services/store.js";
import CustomError from "../utils/error/error.js";

export const GetAdminStore = async (req, res, next) => {
  const { store_id, merchant_id } = req.user;

  try {
    //View private store info
    if (!store_id || !merchant_id) {
      throw new CustomError("Invalid Request", 400);
    }

    const store = await getUserStore({ store_id_slug: store_id });

    //If data return publish false: throw Error(No store found)
    res.json({ data: store, status: true });
  } catch (e) {
    next(e);
  }
};
export const GetStoreController = async (req, res, next) => {
  const store_slug = req.params.storeSlug;

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
    //View publicly
    if (!store_slug) {
      throw new CustomError("Invalid Request", 400);
    }

    const store = await getUserStore({ store_id_slug: store_slug });

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

export const updateAdminStoreController = async (req, res, next) => {
  const { store_id } = req.user;
  const { updates } = req.body;

  try {
    if (!store_id) {
      throw new CustomError("unauthorized access", 401);
    }

    const store = await updateUserStore({
      store_id,
      updates,
    });
    //If data return publish false: throw Error(No store found)

    res.json({ data: store, status: true });
  } catch (e) {
    next(e);
  }
};
