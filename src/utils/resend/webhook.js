import { Resend } from "resend";

//const resend = new Resend(process.env.RESEND_API_KEY);
const resend = new Resend("re_2jZvsKoc_PMNwUJyfwbpWsRpV2dvfgsuA");
export async function ResendWebhookController(req, res, next) {
  try {
    const payload = await req.text();

    // Throws an error if the webhook is invalid
    // Otherwise, returns the parsed payload object
    const result = resend.webhooks.verify({
      payload,
      headers: {
        id: req.headers["svix-id"],
        timestamp: req.headers["svix-timestamp"],
        signature: req.headers["svix-signature"],
      },
      webhookSecret: process.env.RESEND_WEBHOOK_EMAIL_KEY,
    });

    // Handle the result after validating it
  } catch {
    return new NextResponse("Invalid webhook", { status: 400 });
  }
}
