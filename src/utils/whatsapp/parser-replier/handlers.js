import {
  GetConversationState,
  UpdateConversationState,
} from "../../../repository/whatsapp_state.js";
import { getUserConvoState } from "../../../services/conversation_state.js";
import { WhatsappInteractiveUrlButton } from "../outgoing/message/interactive.js";
import { WhatsappTextMessage } from "../outgoing/message/textmessage.js";
import { IntentConfirmationText } from "./parser.js";
import {
  DeleteSingleProductFlow,
  handleProductLimit,
  ManageSingleProductFlow,
  NoProductFlow,
  ProvideProductsToAdminFlow,
  startAddProductFlow,
  startViewProductFlow,
  updateSingleProductFlow,
} from "./product.js";
import {
  AccessYourStoreFlow,
  DisplayStoreFlow,
  StartStoreCreationFlow,
  StoreCreationSubmission,
} from "./store.js";
import { upgradeSubscriptionFlow } from "./subscription.js";
import { SendHelpToNewUser } from "./support.js";

export const conversationStateExpired = (date) => {
  return new Date() > new Date(date);
};

//'main_menu';
//Clear step and data;
export const handleConvoToMenuState = async (phone) => {
  //clear state
  //Go to MAIN;
};

// 'go_back';
export const handlePrevConversationState = async (phone, step) => {
  if (step === "update_product") {
  }
};

export const handleIntentConfirmation = async (phone, intent) => {
  //this form should ask user if what they sent is what they receive;
  const [action, target] = intent.split("_");
  const preText = IntentConfirmationText({ action, target }, "a");

  //Create a state ( flow:waiting_confirmation_state, step: the_next_intent )

  //Send as Whatsapp Message;
};

//Complete CONVO STATE
export const handleConvoState = async (phone, payload, action) => {
  //Get Current Flow;
  const state = await getUserConvoState(phone);

  // -------- Create Account(Flow Yet) ------
  if (state?.flow === "create_account") {
    if (state.step === "awaiting_email") {
      await OtpCodeToUserEmailFlow(phone);
    }

    if (state.step === "awaiting_otp") {
      await VerifyUserEmailCreationFlow(phone);
    }

    if (state.step === "restart") {
      await RestartCreationFlow(phone);
    }

    if (state.step === "invalid_input_email") {
      await ErrorEmailFlow();
    }

    if (state.step === "invalid_input_otp") {
      await ErrorOtpFlow();
    }

    if (state.step === "timeout_input_otp") {
      await ErrorOtpFlow();
      return;
    }

    //Send A dEFAULT FOR USER INCASE THEY DONT WANT TO;
    await SendHelpToNewUser(phone);
  }

  //------- Store Creation & Subscription;
  if (state?.flow === "create_store") {
    if (state?.step === "store_limit") {
      return;
    }

    if (state?.step === "store_submission") {
      await StoreCreationSubmission();
      return;
    }
    await StartStoreCreationFlow();
  }

  //------- Store Creation & Subscription;
  if (state?.flow === "view_store") {
    if (state?.step === "store_limit") {
      return;
    }

    if (state?.step === "store_submission") {
      await StoreCreationSubmission();
      return;
    }
    await StartStoreCreationFlow();
  }

  ///// ------ ADD PRODUCT ----------
  if (state?.flow === "add_product") {
    if (state.step === "limit_reached") {
      if (action === "upgrade") {
        await upgradeSubscriptionFlow();
      }

      if (action === "remove_product") {
        await ProvideProductsToAdminFlow(
          "Remove your products by clicking the button below",
        );
      }

      if (action === "main_menu") {
        await handleConvoToMenuState();
      }

      await handleProductLimit();
    }

    //Flow Submission;
    if (state.step === "product_submission") {
      //Get Merchant and Store;

      //Generate a temp login token;

      //Create Product
      await createProduct();

      //reset state;
      await UpdateConversationState();

      //Send Success message to user;
      await WhatsappInteractiveUrlButton();
    }
  }

  // ----------------- Lose time -------
  if (state?.flow === "waiting_confirmation_expiredSession") {
    //handle whether a user send a no(rename_to_mainmenu) or yes(rename state e)
  }

  // ----------------- -------
  if (state?.flow === "waiting_confirmation_intent") {
    //handle Initial intent
    //if no - menu
    //if yes - then call handlemenu() with the inital intent and step: 'incoming'
  }

  // ----------------- View Product -------
  if (state?.flow === "view_products") {
    if (state.step === "update_product") {
      //Interactive
      if (action === "edit_product" && state?.data?.product) {
        await ManageSingleProductFlow(); //Clear state
      }

      //Interactive
      if (action === "delete_product" && state?.data?.product) {
        await DeleteSingleProductFlow(); //Clear state;
      }

      //Main menu
      if (action === "main_menu" && state?.data?.product) {
        await handleConvoToMenuState(); //Clear state;
      }

      //some Text
      if (!action && state?.data?.product) {
        return "Please click the buttons provide, then resendupdateSingleProductFlow(phone, payload);";
      }

      //Search product and Show Product Detail
      await updateSingleProductFlow(phone, payload);
    }

    if (state.step === "no_products") {
      //Main menu
      if (action === "main_menu") {
        await handleConvoToMenuState(); //Clear state;
      }

      if (action === "add_product") {
        await startAddProductFlow(); //Clear state;
      }

      // Show Product Detail
      await NoProductFlow(phone, payload);
    }
  }
};

//Initalize conversation
export const handleMenu = async (intent, phone) => {
  switch (intent) {
    // Maybe from Text
    case "create_account":
      await startAccountCreation();

    case "create_store":
      await StartStoreCreationFlow();

    case "view_store":
      await DisplayStoreFlow();

    case "access_store":
      await AccessYourStoreFlow();

    //Along menu -- interactive
    case "add_product":
      await startAddProductFlow(phone);

    case "view_products":
      await startViewProductFlow(phone);
  }
};

//Transform whatsapp message and send a response!
export const whatsapp_message_webhook_processsor = (body) => {
  let temp = {};

  console.log(JSON.stringify(body));
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
