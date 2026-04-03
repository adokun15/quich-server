import { whatsappMessage } from "../../../utils/whatsapp.js";

export async function sendProductFlowForm(phonenumber) {
  const extras = {
    type: "template",
    template: {
      name: "payment_success_upgrade",
      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: `${user?.name}`,
            },
            {
              type: "text",
              text: `${user?.plan}`,
            },
            {
              type: "text",
              text: `${user?.amt}`,
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
