import { z } from "zod";

export const stkPushSchema = z.object({

    phone: z.string(),

    amount: z.number()
        .int()
        .positive(),

    accountReference: z.string()
        .min(1)
        .max(20),

    description: z.string()
        .min(1)
        .max(50),

});