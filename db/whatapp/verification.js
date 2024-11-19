import generateUniqueId from "generate-unique-id";
import { whatsappMessage } from "../../utils/whatsapp.js";

export async function sendPhoneNumberVerificationCode(phonenumber) {
  const textVerificationCode = generateUniqueId({
    useLetters: false,
    useNumbers: true,
    length: 6,
  });

  const extras = {
    type: "template",
    template: {
      name: "verification_code",
      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: textVerificationCode,
            },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            {
              type: "text",
              text: textVerificationCode,
            },
          ],
        },
      ],
    },
  };

  return await whatsappMessage(phonenumber, extras)
    .then((data) => {
      console.log(data);
      return textVerificationCode;
    })
    .catch((e) => console.log(e));
}
