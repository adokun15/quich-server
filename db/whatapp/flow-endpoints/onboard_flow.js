/* Deprecated for now! */
import { whatsappMessage } from "../../utils/whatsapp.js";

export async function Onboard(phonenumber, name, customer, cart) {
  const { customer_name, customer_phone } = customer;

  const { items, totalAmt, orderId } = cart;

  const formattedCartItems = items
    .map((item) => `${item.qty} ${item.name} ${item.total}`)
    .join("\n");

  const extras = {
    type: "template",
    template: {
      name: "order_request",
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
              text: `${orderId}`,
            },
            {
              type: "text",
              text: `${customer_name}`,
            },
            {
              type: "text",
              text: `${customer_phone}`,
            },
            {
              type: "text",
              text: `${totalAmt}`,
            },
            {
              type: "text",
              text: `${formattedCartItems}`,
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
