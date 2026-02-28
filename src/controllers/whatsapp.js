/**
 Decrypt whatsapp request and transform data then send back request;
 */

import { verifySignature } from "../utils/middleware/verifyMetaRequest";

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

export const whatsapp_webhook_controller = async (req, res, next) => {
  //RECEIVE ALL WEBHOOK: Flow and message!
  if (!verifySignature(req)) {
    return res.sendStatus(403);
  }
  console.log("Valid payload:", req.body);
  res.sendStatus(200);
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
