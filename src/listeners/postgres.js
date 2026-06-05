import pgClient from "../config/postgres.js";
import { publisher } from "../config/redis.js";

const startPostgresListener = async () => {
  await pgClient.connect();

  await pgClient.query("LISTEN orders_channel");

  await publisher.publish("orders-events", msg.payload);

  pgClient.on("notification", async (msg) => {
    console.log("Notification received:", msg.payload);
  });
};

export default startPostgresListener;
