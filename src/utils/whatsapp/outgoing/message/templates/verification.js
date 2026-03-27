import { whatsappMessage } from "../../../utils/whatsapp.js";
import CustomError from "../../../utils/error.js";

export async function sendPhoneNumberVerificationCode(
  phonenumber,
  textVerificationCode,
) {
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
      return textVerificationCode;
    })
    .catch(({ error }) => {
      /**
        {
          error : {
            message: '',
            type:  '',
            code: 100 || '',
            error_subcode: 33 || '',
            fbtrace_id: ''
            }
        }
       */
      throw new CustomError(error?.message, 500);
    });
}
