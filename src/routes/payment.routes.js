import {Router} from "express";
import paymentController from "../controllers/payment.controller.js";
import {validate} from "../middlewares/validate.js";
import {
    stkPushSchema,
    idempotencyKeyHeaderSchema,
} from "../validators/payment.validator.js";

const router = Router();

router.post("/stk-push",
    validate(stkPushSchema),
    validate(idempotencyKeyHeaderSchema, "headers"),
    paymentController.initiateSTKPush
);

router.post(
    "/callback",
    paymentController.handleCallback
);

export default router;