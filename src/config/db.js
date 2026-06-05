import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();

    console.log("PostgreSQL Connected Successfully");

    client.release();
  } catch (error) {
    console.error("PostgreSQL Connection Failed", error);

    process.exit(1);
  }
};
