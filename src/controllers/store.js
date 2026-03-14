import getAllStoreProducts, { updateUserStore } from "../services/store.js";

export const GetStoreController = async (req, res) => {
  const storeLink = req.params.storeSlug;

  const temp_model = {
    store_id: "demo-store-id",
    store_profile: null,
    store_bio: "Fruit mart at your doorstep!",
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

  res.json({ data: temp_model, status: true });
};

export const GetStoreProductsController = async (req, res) => {
  const storeLink = req.params.storeSlug;

  res.json({
    data: {
      store_slug: storeLink,
      products: [
        {
          product_id: "product_id_1",
          product_name: "PineApple",
          product_img: [],
          amount: 1000,
        },
        {
          product_id: "product_id_2",
          product_name: "Apple",
          product_img: [],
          amount: 300,
        },
        {
          product_id: "product_id_3",
          product_name: "Banana",
          product_img: [],
          amount: 500,
        },
      ],
    },
    status: true,
  });
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
