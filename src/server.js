import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initializeSocket } from "./config/socket.js";

dotenv.config();
import startPostgresListener from "./listeners/postgres.js";

const PORT = process.env.PORT || 8000;
initializeSocket(server);
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  await startPostgresListener();
  await publisher.connect();
  await subscriber.connect();
};

startServer();
