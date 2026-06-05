import { createClient } from "redis";

const publisher = createClient({
  url: process.env.REDIS_URL,
});

const subscriber = createClient({
  url: process.env.REDIS_URL,
});

export { publisher, subscriber };
