import dotenv from "dotenv";
import app from "./app.js";
import {config} from './config/env.js';
dotenv.config();

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});