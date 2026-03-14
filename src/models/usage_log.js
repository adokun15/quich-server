import pool from "../utils/database/db"

//Create table;
export const CreateUsageLogforDb = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXIST ( 
            logId: 'serial'
            body_text: ''
            header_text: ''
            merchant_Id: ''
            created_at: ''
      
        )
    `)
  }
}
