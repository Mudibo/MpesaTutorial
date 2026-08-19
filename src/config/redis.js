import { createClient } from "redis";
import { config } from "./env.js";

export const redisClient = createClient({
    url: config.redis.url,
});

redisClient.on("connect", () => {
    console.log("Connecting to Redis Cloud...");
});

redisClient.on("ready", () => {
    console.log("Redis Cloud connected.");
});

redisClient.on("error", (error) => {
    console.error("Redis Error:", error);
});