const Flow = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "102290129340398",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "15550783881",
              phone_number_id: "106540352242922",
            },
            contacts: [
              {
                profile: {
                  name: "Sheena Nelson",
                },
                wa_id: "16505551234",
              },
            ],
            messages: [
              {
                context: {
                  from: "16315558151",
                  id: "gBGGEiRVVgBPAgm7FUgc73noXjo",
                },
                from: "<USER_ACCOUNT_NUMBER>",
                id: "<MESSAGE_ID>",
                type: "interactive",
                interactive: {
                  type: "nfm_reply",
                  nfm_reply: {
                    name: "flow",
                    body: "Sent",
                    response_json:
                      '{"flow_token": "<FLOW_TOKEN>", "optional_param1": "<value1>", "optional_param2": "<value2>"}',
                  },
                },
                timestamp: "<MESSAGE_SEND_TIMESTAMP>",
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

const list_reply_only = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "<WHATSAPP_BUSINESS_ACCOUNT_ID>",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "<BUSINESS_DISPLAY_PHONE_NUMBER>",
              phone_number_id: "<BUSINESS_PHONE_NUMBER_ID>",
            },
            contacts: [
              {
                profile: {
                  name: "<WHATSAPP_USER_PROFILE_NAME>",
                },
                wa_id: "<WHATSAPP_USER_ID>",
                identity_key_hash: "<IDENTITY_KEY_HASH>",
                // <!-- only included if identity change check enabled -->
              },
            ],
            messages: [
              {
                context: {
                  from: "<BUSINESS_DISPLAY_PHONE_NUMBER>",
                  id: "<CONTEXTUAL_WHATSAPP_MESSAGE_ID>",
                },
                from: "<WHATSAPP_USER_PHONE_NUMBER>",
                id: "<WHATSAPP_MESSAGE_ID>",
                timestamp: "<WEBHOOK_TRIGGER_TIMESTAMP>",
                type: "interactive",

                //      <!-- interactive list message replies only -->
                interactive: {
                  type: "list_reply",
                  list_reply: {
                    id: "<ROW_ID>",
                    title: "<ROW_TITLE>",
                    description: "<ROW_DESCRIPTION>",
                  },
                },

                //    <!-- interactive reply button message replies only -->
                interactive: {
                  type: "button_reply",
                  button_reply: {
                    id: "<BUTTON_ID>",
                    title: "<BUTTON_LABEL_TEXT>",
                  },
                },
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};
