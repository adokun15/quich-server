export const whatsappMessage = async (phone, json_data) => {
  const message = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `+234${phone}`,
    ...json_data,
  };

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
  const option = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  };

  try {
    const api_endpoint = await fetch(
      `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONENUMBER_ID}/messages`,
      option
    );

    const res = await api_endpoint.json();

    return res;
  } catch (e) {
    console.log(e);
  }
};
