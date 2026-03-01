const error = {
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
            errors: [
              {
                code: "<ERROR_CODE>",
                title: "<ERROR_TITLE>",
                message: "<ERROR_MESSAGE>",
                error_data: {
                  details: "<ERROR_DETAILS>",
                },
                href: "<ERROR_CODES_URL>",
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

//Unsupported Type: Send back to Client;
const unsupport = {
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
              },
            ],
            messages: [
              {
                from: "<WHATSAPP_USER_PHONE_NUMBER>",
                id: "<WHATSAPP_MESSAGE_ID>",
                timestamp: "<WEBHOOK_TRIGGER_TIMESTAMP>",
                errors: [
                  {
                    code: 131051,
                    title: "Message type unknown",
                    message: "Message type unknown",
                    error_data: {
                      details: "Message type is currently not supported.",
                    },
                  },
                ],
                type: "unsupported",
                unsupported: {
                  type: "<UNSUPPORTED_TYPE>",
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
