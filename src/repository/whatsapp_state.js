import pool from "../utils/database/db.js";
import CustomError from "../utils/error/error.js";

//Create last intent: access by one person
export async function CreateConversationState(query) {
  try {
    await pool.query(
      `
      INSERT INTO conversation_state(phone, step, intent, data, missing)
      VALUES ($1, $2, $3, $4, $5) 
      `,
      query,
    );

    //success
    return {};
  } catch (e) {
    throw CustomError(e);
  }
}

//get last intent:
export async function GetConversationState(query) {
  try {
    const res = await pool.query(
      `
      select * from whatsapp_state where phone = $1 
      `,
      query,
    );

    //success
    return res?.rows[0];
  } catch (e) {
    throw new CustomError(e?.message);
  }
}

export async function UpdateConversationState(query) {
  try {
    const res = await pool.query(
      `
      select * from whatsapp_state where phone = $1 
      `,
      query,
    );

    //success
    return res?.rows[0];
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
