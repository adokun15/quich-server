import { whatsappMessage } from "../../utils/whatsapp.js";

export async function FeatureAnnouncement(phonenumber, Fname, benefit) {
  const extras = {
    type: "template",
    template: {
      name: "features_announcement",
      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: `${Fname}`,
            },
            {
              type: "text",
              text: `${benefit}`,
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
