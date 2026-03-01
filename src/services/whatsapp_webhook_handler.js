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
  //Get Last Intent Data FROM DB: ` INTENT_NAME_STEP | JSON`
  //Send Back a Response!
  //Store conversation info;
  // ---Probably do other thing: Db invocation | Other Action
};

export const executeTextIntent = async (new_intent, isIntentKnown, phone) => {
  //Get Last Intent Data FROM DB: ` INTENT_NAME_STEP`
  /*
  IF INTENT IS UNKNOWN {
    //cHECK LAST INTENT IF AVAILABLE 

    //dUE WHICH PART WAS UNCLEAR

    //SEND DEFAULT MESSAGE;
   }
  */
  //Send Back a hearty Response!
  //Store Intent Info;
  //Probably do other thing: Db invocation | Other Action
};

export const GetUserIntent = ({ type, payload }) => {
  //Check In
  //Trying To Guess What the User Want?
};

//This is what our whatsapp-webhook-controller will call;
export const whatsapp_message_webhook_processsor = (req) => {
  /* 
   This function will be long:
   use to detect what kind of
  responds we get and TRANSFORM IT */

  return {
    type: "",
    message_type: "",
    payload: {},
  };
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
