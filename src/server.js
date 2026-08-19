import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { redisClient } from "./config/redis.js";
import { config } from "./config/env.js";

async function startServer() {
    try {

        await redisClient.connect();

        app.listen(config.port, () => {
            console.log(
                `Server running on ${config.port}`
            );
        });

    } catch (error) {

        console.error(error);

        process.exit(1);

    }
}

startServer();