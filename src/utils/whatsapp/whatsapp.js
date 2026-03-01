export const WhatsappUrlForMessages = async (payload) => {
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

    return { status: "success", res };
  } catch (e) {
    console.log(e);
    //Return an instance of Error;
    return { status: "failed", message: "Failed to send!" };
  }
};

export const WhatsappUrlForTemplate = async (payload) => {
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
