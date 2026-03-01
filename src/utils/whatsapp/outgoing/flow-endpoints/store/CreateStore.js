const SCREEN_RESPONSES = {
  CREATE_INIT: {},
  STORE_DETAILS: {},
  STORE_URL: {},
  SUMMARY: {},
  SUCCESS: {},
};

/*
  try {
    //get email, display name from getAuth
    const { email, display_name } = await getAuth().getUser(uid);

    const { customerCode } = await Customer({
      name: display_name || "",
      email,
    });

    //Generate some Store Link
    const linkGenerated = generateUniqueId({
      length: 6,
      useLetters: false,
      excludeSymbols: ["@", "#", "$", "%", "^", "&", "*", "!"],
    });

    const linkName =
      data?.business_name
        ?.split(" ")
        .map((n) => n)
        .join("-") + `-${linkGenerated}`;

    //Collect first name, last name, storelink, store name, store description, store industry (Category)
    await getFirestore().collection("users").doc(`${uid}`).update({
      link: linkName,
      customer_code: customerCode,
    });

    await getFirestore().collection("store/").doc(`${linkName}`).set({
      userId: uid,
      businessName: data?.bu2siness_name,
      description: data?.business_desc,
      industry: data?.business_category,
      phone: "",
      published: true,
      status: "Store Unverified",
    });

    return {
      message: `Success. store link generated (${linkName})`,
      link: linkName,
    };
  } catch (e) {
    throw new CustomError(e?.message || "SOMETHING WENT WRONG", 500);
  }

*/
