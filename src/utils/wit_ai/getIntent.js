import CustomError from "../error/error.js";

//Get Intent;
export const witai_getIntent = async ({ message }) => {
  const wit_res = await fetch(`${process.env.WIT_API}/message?q=${message}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.WIT_AUTH_TOKEN}`,
    },
  });

  const wit_data = await wit_res.json();

  if (wit_data?.error) {
    throw new CustomError(wit_data?.error, wit_data?.code);
  }

  //transform data

  //Return Data
  return wit_data;
};
