import { z } from "zod";

export const stkPushSchema = z.object({

    phone: z.string().trim().min(1, "Phone number is required"),

    amount: z.number({invalid_type_error: "Amount must be a number"})
        .int("Amount must be an integer")
        .positive("Amount must be greater than zero"),

    description: z.string()
        .min(1, "Description is required")
        .max(50, "Description is too long"),
});

export const idempotencyKeyHeaderSchema = z.object({
    "idempotency-key": z.uuid("Idempotency key must be a valid UUID"),
});