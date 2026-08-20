import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import healthRoutes from "./routes/health.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

app.use("/health", healthRoutes);

app.use(helmet());

app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

app.use(morgan("dev"));

app.use("/api/v1/payments", paymentRoutes);

export default app;