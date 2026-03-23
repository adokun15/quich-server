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
import { witai_getIntent } from "../utils/wit_ai/getIntent.js";

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

  //What did the Whatsapp send, then transform 'whatsapp' object;
  const { type, message_type, payload } = whatsapp_message_webhook_processsor(
    req?.body,
  );

  //--------Incoming Message-------
  if (type === "message") {
    //Text: Usally first step
    if (message_type === "text") {
      //What does the user want? { intent, ...data }
      const { intents, entities } = witai_getIntent({ message: "" });

      //What is next action or question?
      await executeTextIntent(intents, entities, phone);
    }

    //Interactive: (Flow, reply button, list buttons)
    if (message_type === "interactive") {
      await executeInteractiveResult(payload);
    }

    //Media message
    //if (message_type === "media") {}

    //Location message
    //if (message_type === "location") {}
  }

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
