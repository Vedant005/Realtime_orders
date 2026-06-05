import { subscriber } from "../config/redis.js";

import { getIO } from "../config/socket.js";

const startRedisListener = async () => {
  await subscriber.subscribe("orders-events", (message) => {
    const io = getIO();

    const payload = JSON.parse(message);

    console.log("Redis Event:", payload.eventType);

    io.emit(payload.eventType, payload);
  });

  console.log("Redis listener started");
};

export default startRedisListener;
