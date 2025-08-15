// src/middlewares/rateLimiter.ts
import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: "Too many login attempts from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});
