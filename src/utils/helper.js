import { GetLastIntentState } from "../repository/whatsapp_state.js";
import { executeIntent } from "../services/whatsapp_webhook_handler.js";

//Complete CONVO STATE
export const handleConvoState = async (message, ctx) => {
  const field = ctx.step;

  //Extract 'Value' with expected format message; Single Text(Manual) or single
  const value = extractField(field, message);

  if (!value) {
    //Reply to User message;
    return;
  }

  ctx.data[field] = value;

  //remove filled field;
  const remaining_field = ctx.missing.filter((f) => f !== field);

  //Mark as Completed
  if (remaining_field.length === 0) {
    //Send a default message to user after
    await executeIntent(ctx.intent, ctx.data);

    await clearIntent(ctx.phone);

    return;
  }

  //If it still have some missing field;
  await UpdateUserConvoState(ctx.phone, {
    ...ctx,
    step: remaining_field[0],
    missing: remaining_field,
  });

  //reply `Please provide us with {orderId}, Thank you! `
};

//Update convo state
export const UpdateUserConvoState = async (phone, data) => {
  //dB update
};

//Check Convo info on Db;
export const getUserConvoState = async (phone) => {
  //Try and validate the input again
  try {
    const intent = await GetLastIntentState([phone]);

    return intent;
  } catch (e) {
    throw new Error(e?.message);
  }
};

//Normalize Entities
export const mapEntities = async (e) => {};
