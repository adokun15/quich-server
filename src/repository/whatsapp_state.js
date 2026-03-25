/*
This file will be used for: 
- Updating user last sent active message;
- Retrieve the info of the user on whatsapp
*/

import pool from "../utils/database/db.js";
import CustomError from "../utils/error/error.js";

//Create last intent: access by one person
export async function ManageLastSentMessages(query) {
  try {
    await pool.query(
      `
      INSERT INTO whatsapp_intent_state(phone, step, intent, data, missing)
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
export async function GetLastIntentState(query) {
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

//Cron Job: Clears every 6 hours
export async function ClearWhatsappMessages(query) {
  try {
    const res = await pool.query(
      `
     DELETE from whatsapp_intent_state WHERE phone = $1       
      `,
      query,
    );

    //success
    return {};
  } catch (e) {
    throw CustomError(e);
  }
}
