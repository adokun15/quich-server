/*
This file will be used for: 
- Updating user last sent active message;
- Retrieve the info of the user on whatsapp


*/

//Called for every webhook received
export function ManageLastSentMessages() {
  return {
    userId: "12-qew-q22-2d-e2",
    messageIds: ["user-message-iD-1", "user-message-Id-2"],
    initialConvoTime: "session-begin-time",
    lastConvoTime: "last-sesion-time",
    isIdle: "more-than-10-mins-without-reply",
  };
}

//Cron Job: Clears every 6 hours
export function ClearWhatsappMessages() {
  return {
    userId: "12-qew-q22-2d-e2",
    messageIds: [],
    initialConvoTime: "session-begin-time",
    lastConvoTime: "last-sesion-time",
    isIdle: "more-than-10-mins-without-reply",
    message: "Logged to admin!",
  };
}
