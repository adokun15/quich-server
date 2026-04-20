import CustomError from "../error/error.js";

export const WhatsappUrlForMessages = async ({ payload }) => {
  const option = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...payload }),
  };

  try {
    const api_endpoint = await fetch(
      `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONENUMBER_ID}/messages`,
      option,
    );

    const res = await api_endpoint.json();
    console.log(res);

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
      throw new CustomError(res?.error?.message);
    }
    return { status: "success", res };
  } catch (e) {
    return { status: "failed", message: e?.message || "Failed to send!" };
  }
};

export const WhatsappUrlForTemplate = async ({ payload }) => {
  const option = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    const api_endpoint = await fetch(
      `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONENUMBER_ID}/messages`,
      option,
    );

    const res = await api_endpoint.json();

    return { status: "success" };
  } catch (e) {
    console.log(e);
    //Return an instance of Error;
    return { status: "failed", message: "Failed to send!" };
  }
};

const url_helper = async (url, option) => await fetch(url, option);

/*
export const WhatsappUrlForMedia = async (method, payload, type='id') => {
  const option = {
    method: method,
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const uploadUrl = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONENUMBER_ID}/media`
  const QueryUrl = `https://graph.facebook.com/v21.0/${payload?.media_id}?phone_number_id=${process.env.WHATSAPP_PHONENUMBER_ID}`
  
  try {
    if(method === 'POST'){
      const api_endpoint = await url_helper(uploadUrl, option);
   
      const res = await api_endpoint.json();

      return { status: "success", media_id: res?.id };
    }
   
    
    const api_endpoint = await url_helper(QueryUrl, option);
    const res = await api_endpoint.json();
   
    if(method === 'GET'){
      return { status: "success", media: {
        url: res?.url,
        mime_type: res?.mime_type,
        sha256: res?.sha256,
        file_size: res?.file_size,
        media_id: res?.id
      }};
    }

    return { status: "success" };
  } catch (e) {
    console.log(e);
    //Return an instance of Error;
    return { status: "failed", message: "Failed!" };
  }
};
*/
//Possibly log this somewhere;
/*{
    messaging_product: 'whatsapp',
    contacts: [ { input: '+2348129584035', wa_id:
  '2348129584035' } ],
    messages: [
      {
        id: 'wamid.HBgNMjM0ODEyOTU4NDAzNRUCABEYEkV
  CQ0MyNTAzQjFFMTg1MUIwNwA='
      }
    ]
  }
*/
