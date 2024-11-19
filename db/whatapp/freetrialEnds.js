import { whatsappMessage } from "../../utils/whatsapp.js";

export async function TrialEnded(phonenumber, name) {
  const extras = {
    type: "template",
    template: {
      name: "trial_ended",
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
              text: "order processes and whatsapp notification",
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
