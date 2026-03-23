//Get Intent;
export const witai_getIntent = async ({
  message,
  context = null,
  entities,
}) => {
  try {
    const wit_res = await fetch(`${process.env.WIT_API}/message?q=${message}`, {
      method: "GET",
      Authorization: `Bearer ${process.env.WIT_AUTH_TOKEN}`,
    });

    const wit_data = await wit_res.json();

    //Return Data
    return {
      text: "",
      intents: "",
      entities: "",
    };
  } catch (e) {
    throw new Error(e);
  }
};
