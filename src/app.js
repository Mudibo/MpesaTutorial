import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import healthRoutes from "./routes/health.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use("/health", healthRoutes);

/*
|--------------------------------------------------------------------------
| Security Middleware
|--------------------------------------------------------------------------
*/

app.use(helmet());

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
|
| During development we'll allow localhost.
| In production we'll restrict this to trusted origins.
|
*/

app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    })
);

/*
|--------------------------------------------------------------------------
| Request Parsing
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Compression
|--------------------------------------------------------------------------
*/

app.use(compression());

/*
|--------------------------------------------------------------------------
| Logging
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

app.use(morgan("dev"));

export default app;