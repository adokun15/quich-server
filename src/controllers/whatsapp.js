/**
 Decrypt whatsapp request and transform data then send back request;
 */

import { verifySignature } from "../utils/middleware/verifyMetaRequest.js";
import { WhatsappTextMessage } from "../utils/whatsapp/outgoing/message/textmessage.js";
import {
  executeFlowPerfoamanceStatus,
  executeInteractiveResult,
  executeTextIntent,
  executeUserErrorMessage,
  whatsapp_message_webhook_processsor,
} from "../services/whatsapp_webhook_handler.js";

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
  res.status(200).send("Webhook_Received");

  //2. Verify Request
  const verified = verifySignature(req);

  if (!verified) {
    res.status(403).send("INVALID_REQUEST!");
    return;
  }

  //3. Process & Transform Message

  //--------Incoming Message-------
  if (
    req?.body?.object === "whatsapp_business_account" &&
    req?.body?.entry[0].changes[0]?.field === "messages" &&
    !req?.body?.entry[0]?.changes[0]?.value?.statuses
  ) {
    /*
    This Could Mean alot of things; 
   */

    console.log("It works Bro!");

    //What did the user send?: { type, transformed details}
    /*
    const { type, message_type, payload } = whatsapp_message_webhook_processsor(
      req?.body,
    );

    //Text
    if (message_type === "text") {
      //What does the user want? { intent, ...data }
      const { intent, isIntentKnown } = GetUserIntent({ type, payload });

      //What is next action or question? If it has an intent: 'do a switch to process it request';
      await executeTextIntent(intent, isIntentKnown, phone);
    }

    //Interactive: (Flow, reply button, list buttons)
    if (message_type === "interactive") {
      await executeInteractiveResult(payload);
    }
  */
  }

  //----Flow Perfoamance & Status--------
  /*if () {
    //Process any flow message
    await executeFlowPerfoamanceStatus(req?.body);
  }
  
  //--- Failed to send Error for 'a phone' (FCM)/(EMAIL) -- send a email;
  if () {
    //Process any flow message
    await executeUserErrorMessage(req?.body);
  }
  
  //Phone Number Change
  if () {
    //Process any flow message
    await alertUserPhoneNumberChange(req?.body);
  }*/
};

/**
 signup
 create product; Add Product Image
 Customer_blacklist_toggle
 create/delete_store_flow;
 create/delete_store_flow;
 acknowledge_reject_orderCreation_flow
 subscriptions/waybill invoice
 */
/*


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
