import { Pool } from "pg";

// Create a connection pool
const pool = new Pool({
  host: process.env.PGHOST, // LOCALHOST
  user: process.env.PGUSER, // POSTGRES
  database: process.env.PGDATABASE, // your database name
  port: process.env.PGPORT, // default PostgreSQL port
  password: process.env.PGPASSWORD,
});

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
