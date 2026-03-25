//For THE dASHBOARD: VIEW ALL THE PRODUCTS, The STORE [AND] User ACCOUNT
export const alertUserPhoneNumberChange = async () => {
  //--Change UserPhone NUmber
  //--Send A mail to User;
};

export const executeUserErrorMessage = async () => {
  //Send Error to their Emails instead!
};

export const executeFlowPerfoamanceStatus = async () => {
  //Just Send The Message to my Whatsapp;
};

export const executeInteractiveResult = async () => {
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
 */
};

//Get Last Intent Data FROM DB: ` INTENT_NAME_STEP`
export const executeIntent = async (intent, data) => {
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

// TRRNSFORM WHATSAPP OBJECT
export const whatsapp_message_webhook_processsor = (body) => {
  let temp = {};

  //Incoming messages
  if (
    body?.object === "whatsapp_business_account" &&
    body?.entry[0].changes[0]?.field === "messages" &&
    !body?.entry[0]?.changes[0]?.value?.statuses
  ) {
    temp.name = body?.entry[0].changes[0]?.value?.contacts[0]?.profile?.name;
    temp.phone =
      body?.entry[0].changes[0]?.value?.metadata?.display_phone_number;

    //Text Message
    if (body?.entry[0].changes[0]?.value?.messages[0]?.type === "text") {
      temp.type = "message";
      temp.message_type = body?.entry[0].changes[0]?.value?.messages[0]?.type;
      temp.payload = body?.entry[0].changes[0]?.value?.messages[0]?.text?.body;
    }

    //Interactive message;
    if (body?.entry[0].changes[0]?.value?.messages[0]?.type === "interactive") {
      //Flow
      if (
        body?.entry[0].changes[0]?.value?.messages[0]?.interactive?.type ===
        "nfm_reply"
      ) {
        const res =
          body?.entry[0].changes[0]?.value?.messages[0]?.interactive?.nfm_reply
            ?.response_json;

        temp.type = "message";
        temp.message_type =
          body?.entry[0].changes[0]?.value?.messages[0]?.interactive?.type;
        temp.payload = res;
      }
      //Reply Message;
      const replyType =
        body?.entry[0].changes[0]?.value?.messages[0]?.interactive?.type;

      if (replyType === "list_reply") {
        temp.type = "message";
        temp.message_type = replyType;
        temp.payload = {
          id: body?.entry[0].changes[0]?.value?.messages[0]?.interactive
            ?.list_reply?.id,
          title:
            body?.entry[0].changes[0]?.value?.messages[0]?.interactive
              ?.list_reply?.title,
          description:
            body?.entry[0].changes[0]?.value?.messages[0]?.interactive
              ?.list_reply?.description || "",
        };
      }

      if (replyType === "button_reply") {
        temp.type = "message";
        temp.message_type = replyType;
        temp.payload = {
          id: body?.entry[0].changes[0]?.value?.messages[0]?.interactive
            ?.button_reply?.id,
          title:
            body?.entry[0].changes[0]?.value?.messages[0]?.interactive
              ?.button_reply?.title,
        };
      }
    }
  }
  //Detect: Flow perfoamance;

  //Failed to send error

  //Phone number change!
  return temp;
};

//Listen for changes on whatsapp and send a response!

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
