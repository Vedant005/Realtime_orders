import dotenv from "dotenv";
dotenv.config();

import http from "http";

import app from "./app.js";

import { connectDB } from "./config/db.js";
import { initializeSocket } from "./config/socket.js";

import startPostgresListener from "./listeners/postgres.js";
import startRedisListener from "./listeners/redis.js";

import { publisher, subscriber } from "./config/redis.js";

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

initializeSocket(server);

const startServer = async () => {
  try {
    await connectDB();

    await publisher.connect();
    await subscriber.connect();

    await startPostgresListener();
    await startRedisListener();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
