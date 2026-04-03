//Parsing User Text;
const INTENTS_CONFIG = [
  {
    key: "add_product",
    action: "create",
    target: "product",
  },
  {
    key: "view_products",
    action: "view",
    target: "product",
  },
  {
    key: "create_account",
    action: "create",
    target: "account",
  },
  {
    key: "create_store",
    action: "create",
    target: "store",
  },
  {
    key: "view_store",
    action: "view",
    target: "store",
  },
  {
    key: "access_store",
    action: "login",
    target: "store",
  },

  //Others
  {
    key: "view_menu",
    action: "view",
    target: "menu",
  },
  {
    key: "manage_product",
    action: "update",
    target: "product",
  },
];

const SYNONYMS = {
  //aCTION
  view: ["display", "see", "show", "select"],
  create: ["add", "create", "put", "insert", "build"],
  update: ["delete", "update", "remove", "change"],

  //Target
  menu: ["menu", "main", "menus", "guide", "navigation"],
  account: ["account", "signup"],
  store: ["shop", "store", "market", "marketplace"],
  products: ["item", "items", "goods", "products", "product"],
};

//const PREFIXES = ['i want to', 'abeg', 'please', 'let me']

const expandIntent = (action, target) => {
  const actionWords = SYNONYMS[action] || [action];
  const targetWords = SYNONYMS[target] || [target];

  const phrases = [];

  actionWords.forEach((a) => {
    targetWords.forEach((t) => {
      phrases.push(`${a} ${t}`);
    });
  });
  return phrases;
};

const INTENTS = INTENTS_CONFIG.map((intent) => ({
  ...intent,
  phrases: expandIntent(intent.action, intent.target),
}));

//Function to clear emoji and irrevalent text;
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}

function scoreIntent(message, intents) {
  const text = normalizeText(message);

  let score = 0;

  intents?.phrases.forEach((phrase) => {
    if (text.includes(phrase)) {
      score += 3;
    }
  });

  const words = text.split(" ");

  words.forEach((word) => {
    intents?.phrases.forEach((phrase) => {
      if (text.includes(phrase)) {
        score += 1;
      }
    });
  });
  return score;
}

export function detectIntent(message) {
  let bestIntent = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    const score = scoreIntent(message, intent);

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  return { intent: bestIntent, score: bestScore };
}

export function IntentConfirmationText(intent, article = "your") {
  return `Do you want to ${intent?.action} ${article} ${intent?.target}`;
}

//For THE dASHBOARD: VIEW ALL THE PRODUCTS, The STORE [AND] User ACCOUNT

//export const alertUserPhoneNumberChange = async () => {
//--Change UserPhone NUmber
//--Send A mail to User;
//};

//export const executeUserErrorMessage = async () => {
//Send Error to their Emails instead!
//};

//export const executeFlowPerfoamanceStatus = async () => {
//Just Send The Message to my Whatsapp;
//};

/*export const executeInteractiveResult = async () => {
  /*
    step 1; 
     --Get Last Intent Data FROM DB: ` INTENT_NAME_STEP | JSON`
     
    step 2:
    - Access last convo state;
  
    step 3:
    -Send Back a  Response!
    -Probably do other thing: Db invocation | Other Action
    
    step 4:
    - Save current convo state;
 
};*/

//Get Last Intent Data FROM DB: ` INTENT_NAME_STEP`
/*export const executeIntent = async (intent, data) => {
  switch (intent) {
    //- Based on confidence, depend whether to send a confirmation or direct message;
    case "create_account":

    case "delete_account":

    case "account_summary":

    case "edit_account":

    //Store
    case "create_store":

    case "store_settings":

    case "store_summary":

    case "community":

    case "store_video":

    //Orders
    case "view_order":

    case "view_orders":

    case "add_order":

    case "cancel_order":

    case "mark_order_complete":

    //Products
    case "create_product":

    case "remove_product":

    case "remove_product_from_category":

    case "add_product_to_category":

    case "edit_product":

    case "add_product_image":

    //case "view_product_stats":

    //Customers
    case "all_customers":

    case "recent_customers":

    case "active_customers":

    case "add_customer_to_blacklist":

    case "remove_customer_from_blacklist":

    case "customer_orders":

    case "customer_info":

    //Category
    case "create_category":

    case "update_category":

    case "view_category":

    case "remove_category":

    //Subscription
    case "pause_subscription":

    case "help_subscription":

    case "plans_for_subscription":

    case "resume_subscription":

    case "start_subscription":

    case "subscription_status":

    case "change_subscription":

    //Support
    case "about":

    case "contact":

    case "connect_socials":

    case "give_feedback":

    case "feature_request":

    case "privacy_policy":

    case "company_terms":

    default:
      await DontUnderStandIntent(phone);
  }
};
*/

/*
This route will just listen to messages sent by user to our business number.
Then Respond by triggering other action! 
*/

/*
A demo: User will send hi, we will reply with
*/

//Listen for specific command: but make it easier for seller

/**
 top layer: Ask what they want
 /ORDER [Paused]
 A. GET ORDERS [Id]:!id ? 10 Recents only : Order Details;
 B. CREATE NEW ORDER: Show Flow Form;
 C. UPDATE ORDER [Id]: Show Flow form;
 D. DELETE ORDER [ID]: Send Confirmation button;
 
 /PRODUCT
 E. Products Overview: Number of products on store; Button with (token) to view all without login;
 F. ADD NEW PRODUCT: Show Flow Form
 G. UPDATE A PRODUCT [id]: Show flow form
 H. DELETE A PRODUCT [id]: Show Flow Form
 
 /CUSTOMER [Paused]
 I. VIEW ALL CUSTOMERS [latest | most-active]: top 50 customers 
 
 /OTHERS
I. STORE SETTINGS: [ Flow Form ] : (VISIBILTY, DETAILS, LOGO, COMMUNITY LINK); 
J. MANAGE SUBSCRIPTION: [paystack link] | ( Display paystack subscription link )
K. ACCOUNT MANAGEMENT: [flow form ] | ( deletion, email/password change )

/STORE
Here are the list of stores linked to your phone;
1. Dano Pres (https://quich.shop/dano-pres);
2. Pressof (https://quich.shop/yooo) active

//Action
... Switch Store...
... Add new Store...

/whatsapp-channel
You join our whatsapp channel

*/
