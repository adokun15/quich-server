import { Pool } from "pg";

// Create a connection pool
const pool = new Pool({
  user: "postgres", // your postgres username
  host: "localhost", // usually localhost
  database: "quich", // your database name
  password: "amos2005", // the password you set during install
  port: 5432, // default PostgreSQL port
});

pool.on("connect", (client) => {
  console.log("DB connected!");
});
// export default pool;
// for supabase postgres

/*import { Pool } from "pg";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
   // Supabase-specific optimizations
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});
*/
export default pool;
