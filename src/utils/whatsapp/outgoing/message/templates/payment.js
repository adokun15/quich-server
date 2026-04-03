import { whatsappMessage } from "../../../utils/whatsapp.js";

//Subscribe to a plan
export async function NewPaymentPlan(phonenumber, user) {
  const extras = {
    type: "template",
    template: {
      name: "payment_success_plan",
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
              text: `${user?.amt}`,
            },
            {
              type: "text",
              text: `${user?.plan}`,
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

export async function UpgradedPaymentPlan(phonenumber, user) {
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
