import { Client } from "pg";

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

export default pgClient;
