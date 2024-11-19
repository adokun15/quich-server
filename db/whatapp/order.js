import { whatsappMessage } from "../../utils/whatsapp";

export async function newOrder(phonenumber, name, productName) {
  const extras = {
    type: "template",
    template: {
      name: "order_template",
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
