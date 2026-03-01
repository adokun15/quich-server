const phonenumber = {
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
            messages: [
              {
                from: "<WHATSAPP_USER_PHONE_NUMBER>",
                id: "<WHATSAPP_MESSAGE_ID>",
                timestamp: "<WEBHOOK_TRIGGER_TIMESTAMP>",
                type: "system",
                system: {
                  body: "User <WHATSAPP_USER_PROFILE_NAME> changed from <WHATSAPP_USER_PHONE_NUMBER> to <NEW_WHATSAPP_USER_PHONE_NUMBER>",
                  wa_id: "<NEW_WHATSAPP_USER_ID>",
                  type: "user_changed_number",
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
