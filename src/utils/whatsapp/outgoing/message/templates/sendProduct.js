import { WhatsappUrlForTemplate } from "../../../whatsapp.js";

export async function sendProductFlowForm(phonenumber) {
  const extras = {
    type: "template",
    template: {
      name: "",
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

  return await WhatsappUrlForTemplate(phonenumber, extras)
    .then((data) => console.log(data))
    .catch((e) => console.log(e));
}
