/**
 Decrypt whatsapp request and transform data then send back request;
 */

import { verifySignature } from "../utils/middleware/verifyMetaRequest.js";
import { WhatsappTextMessage } from "../utils/whatsapp/outgoing/message/textmessage.js";
import {
  executeFlowPerfoamanceStatus,
  executeInteractiveResult,
  executeUserErrorMessage,
  whatsapp_message_webhook_processsor,
} from "../services/whatsapp_webhook_handler.js";
import { witai_getIntent } from "../utils/wit_ai/getIntent.js";
import {
  //  completeConvoState,
  getUserConvoState,
  mapEntities,
  UpdateUserConvoState,
} from "../utils/helper.js";
import { intents } from "../utils/wit_ai/Intents.js";

//Only webhook can call this route
// this controller is only meant to transform this request
//and send a new request asap

export const whatsapp_verify_controller = async (req, res, next) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFICATION_TOKEN
  ) {
    console.log("Whatsapp Webhook verified");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

//Process incoming Request
export const whatsapp_webhook_controller = async (req, res, next) => {
  //RECEIVE ALL WEBHOOK: Flow and message!

  //1.Send Back a Response : Acknowledge request!
  res.status(200).json({ message: "Webhook_Received" });

  //2. Verify Request
  //const verified = verifySignature(req);

  // if (!verified) {
  // res.status(403).send("INVALID_REQUEST!");
  // return;
  // }

  //3. Process & Transform Message
  //What did the Whatsapp send, then transform 'whatsapp' object;
  const { type, message_type, payload, name, phone } =
    whatsapp_message_webhook_processsor(req?.body);
  const b = whatsapp_message_webhook_processsor(req?.body);

  console.log(b);
  //--------Incoming Message-------
  if (type === "message") {
    //Text: Usally first step
    if (message_type === "text") {
      //    console.log(b);

      //1. Check user context;
      const ctx = await getUserConvoState(phone);

      console.log(ctx);

      /////// curerent step: log out (03:10)

      //----MID-FLOW CONVO--------
      //2.  Check if user is in a waiting step; Mid Flow
      if (ctx.step) {
        await handleConvoState(payload, ctx);
        return;
      }

      // ----- INITIAL FREE TEXT -------
      const { intents: intent, entities,  } = await witai_getIntent({
        message: payload,
      });

      

      //3. Check if intent exists in our wit_ai or the locally stored ones
      if (!intent || !intents[intent]) {
        //Reply "I dont understand" to users;
       console.log("Man i dont understand, Like what do you want?")
      }
      
        /*    
          //4. Extract field
          const required_intents = intents[intent];
          //const required_intents = [];
          
          const extractedEntities = mapEntities(entities); //{ "product_name": "Mango" }
          
          const missing = required_intents.filter(
            (field) => extractedEntities[field],
            );
            
            //5. Update convo state
            if (missing.length > 0) {
              await UpdateUserConvoState(phone, {
                step: missing[0],
                intent: intent,
                data: extractedEntities,
                missing,
          });
          
          
          //6. Tell User what info you need again;
          //Please Provide the info;
          return;
          }
          */
    }

    //Interactive:
    // --- (Flow Response) ---
    if (message_type === "nfm_reply") {
      console.log(b);
      // await executeInteractiveResult(payload);
    }

    //  (reply button, list buttons)
    if (message_type === "button_reply" || message_type === "list_reply") {
      console.log(b);
    }

    //Media message
    //if (message_type === "media") {}

    //Location message
    //if (message_type === "location") {}
  }

  /*
    //----Flow Perfoamance & Status--------
    if (type === "flow_perfoamance") {
      await executeFlowPerfoamanceStatus(req?.body);
      }
      
  //--- Failed to send Error for 'a phone' (FCM)/(EMAIL) -- send a email;
  if (type === "user_error") {
    await executeUserErrorMessage(req?.body);
  }

  //Phone Number Change
  if (type === "phone_number_change") {
    await alertUserPhoneNumberChange(req?.body);
  }
*/
};

/*
userRoute.route("/payment/:type").post(
  AsyncError(async (req, res, next) => {
    const type = req.params.type;

    const uid = req.uid;
    const { email, phone, name } = req.body;

    let plan = null;
    let upgrade = null;

    if (type === "basic") {
      plan = await paymentforBasic(email, uid, phone, name);
      res.json({ url: plan });
    }

    if (type === "standard") {
      plan = await paymentforStandard(email, uid, phone, name);
      res.json({ url: plan });
    }

    if (type === "premium") {
      plan = await paymentforPremium(email, uid, phone, name);
      res.json({ url: plan });
    }

    if (type === "basic_standard") {
      upgrade = await upgradeToStandard(email, uid, phone, name);
      res.json({ url: upgrade });
    }

    if (type === "basic_premium") {
      upgrade = await upgradeFromBasicToPremium(email, uid, phone, name);
      res.json({ url: upgrade });
    }

    if (type === "standard_premium") {
      upgrade = await upgradeFromStandardToPremium(email, uid, phone, name);
      res.json({ url: upgrade });
    }

    next();
    //res.status(400).json({ message: "Bad request!" });
  }),
);
*/
