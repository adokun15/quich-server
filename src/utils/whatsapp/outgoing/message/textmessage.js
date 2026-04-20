//Utility Function to Send text to user;

import { WhatsappUrlForMessages } from "../../whatsapp.js";

export const WhatsappTextMessage = async ({
  phone,
  text_message,
  enable_preview = false,
}) => {
  const message = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phone,
    type: "text",
    text: {
      body: text_message,
      preview_url: enable_preview,
    },
  };

  console.log(message);
  const api_endpoint = await WhatsappUrlForMessages({ payload: message });
  //{status: 'success' | 'error', message: if 'failed'}
  return api_endpoint;
};
