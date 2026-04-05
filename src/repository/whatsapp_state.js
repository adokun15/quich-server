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
  //Just the ["key = $1", "key =  $2"]
  const setClause = Object.keys(updates)
    .map((key, i) => `"${key}" = $${i + 1}`)
    .join(", ");

  //Just the [value1, value2]
  const values = Object.values(updates);

  //Just the [value1, value2, id]
  //Add Id As the Last value
  values.push(id);
  try {
    const res = await pool.query(
      `
        UPDATE whatsapp_state SET ${setClause} where id = ${values.length};
        `,
      values,
    );
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
