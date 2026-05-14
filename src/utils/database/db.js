import { Pool } from "pg";

// Create a connection pool
const pool = new Pool({
  host:
    process.env.NODE_ENV === "production"
      ? "aws-1-eu-west-1.pooler.supabase.com"
      : "localhost", // your postgres username
  user:
    process.env.NODE_ENV === "production"
      ? "postgres.fcjjonixemxsnkqirwsj"
      : "postgres", // usually localhost
  database: process.env.NODE_ENV === "production" ? "postgres" : "quich", // your database name
  port: process.env.NODE_ENV === "production" ? 6543 : 5432, // default PostgreSQL port
  password:
    process.env.NODE_ENV === "production" ? "PGuokcLLPqELuwoe" : "amos2005",
  // max: 20,
  // idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  // connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  //ssl: { rejectUnauthorized: false },
});
//postgresql://postgres.fcjjonixemxsnkqirwsj:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres // the password you set during install

pool.on("connect", (client) => {
  console.log("DB connected!");
});
// export default pool;
// for supabase postgres

/*import { Pool } from "pg";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
   // Supabase-specific optimizations
  max: 20, // Maximum number of clients in the pool
});
*/
export default pool;
