//Discord Logger!
export async function DiscordPaystackLogger({
  merchant_id,
  action_type,
  title = "Paystack notice!",
  note,
}) {
  await fetch(process.env.DISCORD_PAYSTACK_LOG_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: title,
      content: note,
      embeds: [
        {
          fields: [
            {
              name: "Merchant_id",
              value: merchant_id,
              inline: true,
            },
            {
              name: "action_type",
              value: action_type,
              inline: true,
            },
          ],
        },
      ],
    }),
  });
}
