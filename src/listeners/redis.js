const { subscriber } = require("../config/redis");

const { getIO } = require("../sockets/socket");

const startRedisListener = async () => {
  await subscriber.subscribe("orders-events", (message) => {
    const io = getIO();

    const payload = JSON.parse(message);

    console.log("Redis Event:", payload.eventType);

    io.emit("order_update", payload);
  });

  console.log("Redis listener started");
};

module.exports = startRedisListener;
