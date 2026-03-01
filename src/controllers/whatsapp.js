/**
 Decrypt whatsapp request and transform data then send back request;
 */

import { verifySignature } from "../utils/middleware/verifyMetaRequest.js";
import { WhatsappTextMessage } from "../utils/whatsapp/outgoing/message/textmessage.js";

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
  /* if (!verifySignature(req)) {
    return res.sendStatus(403);
  }*/

  console.log(req.body);

  const message_request = await WhatsappTextMessage(
    "8129584035",
    "Hello, Quichshop is almost done!",
  );

  console.log(message_request);

  //  console.log("Valid payload:", req.body);
  res.sendStatus(200);
  /* From User Message*/
  //Transform Request

  //Get Intent

  //Save to Db if necessary

  //Send BACK REPLY

  /* From User Flow*/
  //Transform Request

  //Save to Db if necessary

  //Send BACK REPLY
  //

  /* From WHATSAPP */
  //Transform request

  //Send Reply | Save to Db?
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
//

fLOW MESSAGE ESSAGE
{
  "messages": [{
    "context": {
      "from": "16315558151",
      "id": "gBGGEiRVVgBPAgm7FUgc73noXjo"
    },
    "from": "<USER_ACCOUNT_NUMBER>",
    "id": "<MESSAGE_ID>",
    "type": "interactive",
    "interactive": {
      "type": "nfm_reply",
      "nfm_reply": {
        "name": "flow",
        "body": "Sent",
        "response_json": "{\"flow_token\": \"<FLOW_TOKEN>\", \"optional_param1\": \"<value1>\", \"optional_param2\": \"<value2>\"}"
      }
    },
    "timestamp": "<MESSAGE_SEND_TIMESTAMP>"
  }]
}

Perfoamance and status webhook
{
  "entry": [
      {
        "id": "644600416743275",
        "time": 1684969340,
        "changes": [
          {
            "value": {
              "event": "FLOW_STATUS_CHANGE",
              "message": "Flow Webhook 3 has been created with DRAFT status",
              "flow_id": "6627390910605886",
              "new_status": "DRAFT"
              "warning": "Your current Flow version will freeze in 21 days. You won't be able to send the Flow after it expires. Please migrate to the recommended version as soon as possible. https://developers.facebook.com/docs/whatsapp/flows/changelogs#currently-supported-versions" 
            },
            "field": "flows"
          }
        ]
      }
    ],
    "object": "whatsapp_business_account"
}
{
  "entry": [
    {
      "id": "106181168862417",
      "time": 1674160476,
      "changes": [
        {
          "value": {
            "event": "CLIENT_ERROR_RATE",
            "message": "The flow client request error rate has reached the 5% threshold in the last 60 minutes. A higher error rate will make it harder for users to complete the flow, resulting in drop-offs.",
            "flow_id": "691244242662581",
            "error_rate": 14.28,
            "threshold": 10,
            "alert_state": "ACTIVATED",
            "errors": [
              {
                "error_type": "INVALID_SCREEN_TRANSITION",
                "error_rate": 66.66,
                "error_count": 2
              },
              {
                "error_type": "PUBLIC_KEY_MISSING",
                "error_rate": 33.33,
                "error_count": 1
              },
            ],
          },
          "field": "flows"
        }
      ]
    }
  ],
  "object": "whatsapp_business_account"
}
//eNPPOINGT
{
  "entry": [
    {
      "id": "106181168862417",
      "time": 1674160476,
      "changes": [
        {
          "value": {
            "event": "ENDPOINT_ERROR_RATE",
            "message": "The flow endpoint request error rate has reached the 10% threshold in the last 30 minutes. A higher error rate will make it harder for users to complete the flow, resulting in drop-offs.",
            "flow_id": "691244242662581",
            "error_rate": 14.28,
            "threshold": 10,
            "alert_state": "ACTIVATED",
            "errors": [
              {
                "error_type": "CAPABILITY_ERROR",
                "error_rate": 66.66,
                "error_count": 2
              },
              {
                "error_type": "TIMEOUT",
                "error_rate": 33.33,
                "error_count": 1
              },
            ],
          },
          "field": "flows"
        }
      ]
    }
  ],
  "object": "whatsapp_business_account"
}

//Availaiblity
{
  "entry": [
    {
      "id": "106181168862417",
      "time": 1674160476,
      "changes": [
        {
          "value": {
            "event": "ENDPOINT_AVAILABILITY",
            "message": "The flow endpoint availability has breached the 90% threshold in the last 10 minutes. Users will be unable to open or use the flow.",
            "flow_id": "12345678",
            "alert_state: "ACTIVATED",
            "availability": 75,
            "threshold" : 90,
          },
          "field": "flows"
        }

      ]
    }
  ],
  "object": "whatsapp_business_account"
}

//LATENCY
{
  "entry": [
    {
      "id": "106181168862417",
      "time": 1674160476,
      "changes": [
        {
          "value": {
            "event": "ENDPOINT_LATENCY",
            "message": "Flow endpoint latency has reached the p90 threshold in the last 30 minutes. High latency will increase the loading time between screens in the flow, impacting user experience.",
            "flow_id": "691244242662581",
            "p90_latency": 8000,
            "p50_latency": 500,
            "requests_count": 34,
            "threshold": 7000,
            "alert_state": "ACTIVATED",
          },
          "field": "flows"
        }
      ]
    }
  ],
  "object": "whatsapp_business_account"
}
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
