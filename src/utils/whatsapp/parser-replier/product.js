import { getUserConvoState } from "../../../services/conversation_state.js";
import { getSubcriptionInfo } from "../../../services/subscription.js";
import { getMerchantInfo } from "../../../services/users.js";
import {
  WhatsappInteractiveListButton,
  WhatsappInteractiveReplyButton,
} from "../outgoing/message/interactive.js";
import { sendProductFlowForm } from "../outgoing/message/templates/sendProduct.js";

const TRIAL_PRODUCT_LIMIT = 10;
const BASIC_PRODUCT_LIMIT = 30;
const PREMIUM_PRODUCT_LIMIT = 100;
const BUSINESS_PRODUCT_LIMIT = 300;

const BASIC_PLAN = "PLN_codesdsa";
const PREMIUM_PLAN = "PLN_codesdsa";
const BUSINESS_PLAN = "PLN_codesdsa";

//Single Text Only
export const handleProductLimit = async (phone) => {
  //Display current plan and product limit
  //PROVIDE A 'upgrade, maange product, main_menu'
};

//Single Text Only
export const ProvideProductsToAdminFlow = async (phone) => {
  //CLEAR STATE
  //sEND A PRODUCT LINK
};

export const startAddProductFlow = async (phone) => {
  //Search by phone
  const merchant = await getMerchantInfo(phone);

  //iMPLEMENT ASAP
  const product_count = await getMerchantProductCount();

  //Check current subscription and compare before responda
  const { subscription } = await getSubcriptionInfo({
    merchant_id: merchant?.id,
  });

  if (!subscription) {
    return "NO SUBSCRIPTION YET!";
  }

  //check limit
  if (
    (!subscription?.subscription_code || subscription?.plan_code === "trial") &&
    product_count >= TRIAL_PRODUCT_LIMIT
  ) {
    return "Cannot add product, limit reached, Remove existing product to add new one";
  }

  if (
    subscription?.plan_code === BASIC_PLAN &&
    product_count >= BASIC_PRODUCT_LIMIT
  ) {
    // Add to flow state : 'add_product', step: 'limit_reached',
    return "Cannot add product, limit reached, Remove existing product to add new one, upgrade this one";
  }

  if (
    subscription?.plan_code === PREMIUM_PLAN &&
    product_count >= PREMIUM_PRODUCT_LIMIT
  ) {
    // Add to flow state : 'add_product', step: 'limit_reached',
    return "Cannot add product, limit reached, Remove existing product to add new one, upgrade this one";
  }
  if (
    subscription?.plan_code === BUSINESS_PLAN_PLAN &&
    product_count >= BUSINESS_PRODUCT_LIMIT
  ) {
    // Add to flow state : 'add_product', step: 'limit_reached',
    return "Cannot add product, limit reached, Remove existing product to add new one, upgrade this one";
  }

  // update flow state to product_submission;
  await sendProductFlowForm();
};

export const ManageSingleProductFlow = async (phone, query) => {
  //Cleare State and flow
  //Return a link
};

//Deduct message limit; 2
export const updateSingleProductFlow = async (phone, query) => {
  const { data } = await getUserConvoState(phone);

  const product_query = Number(query);

  if (isNaN(product_query)) {
    return "invalid Enter the number of the product you wanna see try again";
  }

  const product_id = product_query - 1;

  //const product = data.find((p) => (p.product?.product_id = product_id));
  const product = {};
  if (!product) {
    return "Not Found";
  }
  //Deduct 2 from their credit;

  //Update flow: step: 'update_product', data: { products, product: the_product? };

  //fetch product detail
  await WhatsappInteractiveListButton({
    phone,
    header_text: "Product Detail",
    body_text: `
    Product:
    Nivea Body Cream

    Price:
    NGN800

    Quantity:
    13 left
    `,
    footer_text:
      "Click 'edit' will generate a link to your dashboard to change this product",
    sections_list: [
      {
        title: "Manage Product",
        rows: [
          {
            id: "edit_product", //Step
            title: "Edit",
          },
          {
            id: "delete_product", //Step
            title: "Delete",
          },
          {
            id: "main_menu", //Step
            title: "Main menu",
          },
        ],
      },
    ],
  });
};

//Deduct message limit;
export const NoProductFlow = async (phone, query) => {
  //Clear state;

  return "No product in your store. suggest";
};

//Deduct message limit;
export const DeleteSingleProductFlow = async (phone) => {
  //START A STATE_CONVO;
  //Then SEND
  // 'Here are your recently added products' with buttons
  // (See all products -url);
  // (Back to main menu -return menu);
};

//Deduct message limit; 2 credit
export const startViewProductFlow = async (phone) => {
  //Search by phone
  const merchant = await getMerchantInfo(phone);

  //IMPLEMENT ASAP
  const product_count = await getMerchantProductCount();

  if (product_count === 0) {
    //Update flow: step: 'no product';
    return "No PRODUCTS IN STORE, YET";
  }

  //IMPLEMENT ASAP
  const products = await getproduct();

  const productListString = products
    ?.map((p, i) => `${i + 1}. ${p?.product_name}`)
    .join("\n");

  //Send A comprehensive list:

  //Update flow: step: 'update_product', data: { products };

  await WhatsappInteractiveReplyButton({
    phone,
    header_content: {
      text_header: "Available product in your store!",
    },
    body_text: `${productListString}`,
    footer_text: "Reply with number(e.g 1,2,3) of the product you want to see",
    action_button_text: "Main menu",
  });
};
