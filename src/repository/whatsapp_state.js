import { ClauseExtractor } from "../utils/database/ClauseExtractor.js";
import pool from "../utils/database/db.js";
import CustomError from "../utils/error/error.js";

//Create last intent: access by one person
export async function CreateConversationStateRepository({
  merchant_id,
  phone,
  step = null,
  flow = null,
  data = null,
}) {
  try {
    const res = await pool.query(
      `
      INSERT INTO conversation_state(merchant_id, phone, step, flow, data)
      VALUES ($1, $2, $3, $4) 
      returning *;
      `,
      [merchant_id, phone, step, flow, data],
    );

    //success
    return res.rows[0];
  } catch (e) {
    throw CustomError(e);
  }
}

export async function GetConversationState({ identifier }) {
  try {
    const res = await pool.query(
      `
      select * from conversation_state where phone = $1 OR merchant_id = $1 
      `,
      [identifier],
    );

    //success
    return res?.rows[0];
  } catch (e) {
    throw new CustomError(e?.message);
  }
}

export async function UpdateConversationState({ new_data, identifier }) {
  const { values, setClause, id } = ClauseExtractor({
    updates: new_data,
    id: identifier,
  });
  try {
    const res = await pool.query(
      `
      UPDATE conversation_state_state 
      SET ${setClause} where phone = $${id} OR merchant_id = $${id}
      returning *
      `,
      values,
    );
    return res.rows[0];
  } catch (e) {
    throw new CustomError(e?.message);
  }
}

export async function DeleteUserConvoStateFromDb({ identifier }) {
  try {
    const res = await pool.query(
      `
      DELETE from conversation_state WHERE phone = $1 OR merchant_id = $1
      returning *;        
      `,
      [identifier],
    );
    return res.rows[0];
  } catch (e) {
    throw new CustomError(e?.message);
  }
}

//Cron Job: Clears every 1 hours
export async function ClearWhatsappMessages(query) {
  try {
    const res = await pool.query(
      `
     DELETE from conversation_state WHERE phone = $1 AND        
      `,
      query,
    );

    //success
    return {};
  } catch (e) {
    throw CustomError(e);
  }
}
