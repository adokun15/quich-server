import { whatsappMessage } from "../../../utils/whatsapp.js";
import CustomError from "../../../utils/error.js";

//3 NOTIFICATIONS
//Subscription expiring cards
//Invoice: successful(charge.success) / Failed(invoice.payment_failed)
//Invoice Notice of 3 days;
export async function sendExpiringCardNotice(phonenumber, data) {}
export async function sendBillingInvoiceStatus(phonenumber, data) {}
export async function sendBillingInvoiceNotice(phonenumber, data) {
  const extras = {
    type: "template",
    template: {
      name: "billing_invoice",
      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: `You are about to debited of NGN1900 on Monday 25th May, 2026.`,
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
              text: "Manage subscription",
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
