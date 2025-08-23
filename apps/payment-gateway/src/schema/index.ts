import * as z from "zod";

export const merchantSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    password: z.string(),
})

export const apiKeySchema = z.object({
    name: z.string(),
    key_hash: z.string(),
})

export const paymentSchema = z.object({
    merchantId: z.string(),
    orderId: z.string(),
    currency: z.string(),
    clientSecret: z.string(),
    paymentId: z.string(),
    paymentLink: z.string(),
    paymentMethod: z.string(),
    totalAmount: z.number(),
    status: z.string(),
    failureReason: z.string(),
    metadata: z.string(),
})