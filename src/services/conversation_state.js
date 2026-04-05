import {
  GetConversationState,
  UpdateConversationState,
} from "../repository/whatsapp_state.js";

//Create State;
export const conversationCreateState = (date) => {};

//Cron job; Manually delete state every hour;
export const conversationDeleteAllState = (date) => {};

//Update convo state
export const UpdateUserConvoState = async (phone, data) => {
  const updateddata = await UpdateConversationState(phone, {});
  //dB update
};

//Check Convo info on Db;
export const getUserConvoState = async (phone) => {
  //Try and validate the input again
  try {
    const intent = await GetConversationState([phone]);

    return intent;
  } catch (e) {
    throw new Error(e?.message);
  }
};
