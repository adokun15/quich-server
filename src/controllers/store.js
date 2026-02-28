export const GetStoreController = async (req, res) => {
  //Get all product
  const storeLink = req.params.storeSlug;
  const store = await getAllStoreProduct(storeLink);
  res.json(store);
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
  res.json(updateMerchant);
};
