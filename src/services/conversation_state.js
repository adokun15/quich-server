import {
  CreateConversationStateRepository,
  DeleteUserConvoStateFromDb,
  GetConversationState,
  UpdateConversationState,
} from "../repository/whatsapp_state.js";
import CustomError from "../utils/error/error.js";

//Create State;
export const conversationCreateState = async ({
  merchant_id,
  phone,
  flow,
  data,
  step,
}) => {
  try {
    const convo = await CreateConversationStateRepository({
      flow,
      data,
      step,
      phone,
      merchant_id,
    });

    return convo;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

//Cron job; Manually delete state every hour;
export const conversationDeleteAllState = (date) => {};

//Update convo state
export const UpdateUserConvoState = async ({ identifier, new_data }) => {
  try {
    const updateddata = await UpdateConversationState({ identifier, new_data });

    return updateddata;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

export const DeleteUserConvoState = async (id) => {
  try {
    const deleted_data = await DeleteUserConvoStateFromDb({ identifier: id });
    return deleted_data;
  } catch (e) {
    throw new CustomError(e?.message);
  }
};

//Check Convo info on Db;
export const getUserConvoState = async (identifier) => {
  //Try and validate the input again
  try {
    const intent = await GetConversationState(identifier);

    return intent;
  } catch (e) {
    throw new Error(e?.message);
  }
};
