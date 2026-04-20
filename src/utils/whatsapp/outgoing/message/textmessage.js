//Utility Function to Send text to user;

export const WhatsappTextMessage = async ({
  phone,
  text_message,
  enable_preview = false,
}) => {
  const option = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `${phone}`,
      type: "text",
      text: {
        preview_url: enable_preview,
        body: text_message,
      },
    }),
  };

  console.log(JSON.stringify(option));
  try {
    const api_endpoint = await fetch(
      `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONENUMBER_ID}/messages`,
      option,
    );

    console.log(JSON.stringify(api_endpoint));
    const res = await api_endpoint.json();

    console.log(JSON.stringify(res));

    //Res can be
    /*error: {
        message: 'Error validating access token: The session has been invalidated because the user changed their password or Facebook has changed the session for security reasons.',
        type: 'OAuthException',
        code: 190,
        error_subcode: 460,
        fbtrace_id: 'AO8Fr5zsSpp8ji-sfTie6Ws'
      }*/

    /**
         * 
      
    /*
     error: {
        message: '(#131056) (Business Account, Consumer Account) pair rate limit hit',
        type: 'OAuthException',
        code: 131056,
        error_data: [Object],
        fbtrace_id: 'AxTIABiR98IO_Up7CZDca5d'
      }
    */
    if (res?.error) {
      console.log(res?.error);
      throw new CustomError(res?.error?.message);
    }
    return { status: "success", res };
  } catch (e) {
    console.log(e);
    return { status: "failed", message: e?.message || "Failed to send!" };
  }
};
