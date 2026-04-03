import { whatsappMessage } from "../../../utils/whatsapp.js";

//Decrease 10 credits
export async function OutOfStock(phonenumber, name, productName) {
  const extras = {
    type: "template",
    template: {
      name: "item_out_of_stock",
      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: `${name}`,
            },
            {
              type: "text",
              text: `${productName}`,
            },
          ],
        },
      ],
    },
  };

  return await whatsappMessage(phonenumber, extras)
    .then((data) => console.log(data))
    .catch((e) => console.log(e));
}
