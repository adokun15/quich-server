//Utility Function to Send text to user;

import { WhatsappUrlForMessages } from "../../whatsapp";

export const WhatsappTextMessage = async (
  phone,
  text_message,
  enable_preview = false,
) => {
  const message = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `+234${phone}`,
    type: "text",
    text: {
      body: text,
      preview_url: enable_preview,
    },
  };
  const api_endpoint = await WhatsappUrlForMessages(message);
  //{status: 'success' | 'error', message: if 'failed'}
  return api_endpoint;
};
