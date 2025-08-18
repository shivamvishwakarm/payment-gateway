import { Request, Response } from "express";
import authRouter from "./routes/api/auth.routes";
import apiKeyRouter from "./routes/api/apikey.routes";
import paymentRouter from "./routes/api/payment.routes";
import 'dotenv/config'
import express = require('express');
import cookieParser from "cookie-parser";
import { verifyAccessToken } from "./utils/jwt";
import { logger } from "./utils/logger";
import { authenticate } from "./middlewares/auth.middleware";
import cors from "cors";


var app = express();
const port = 3000;

// Middleware: JSON parser
app.use(express.json());
app.use(cookieParser())



app.use("/auth", authRouter);
app.use("/api-keys", authenticate, apiKeyRouter);
app.use("/payments", paymentRouter);  // Todo: add api-key middleware 



/**
 * Root endpoint - Health check
 */
app.get('/', (req: Request, res: Response) => {
    res.send('Payment Gateway API is running.');
});



app.listen(port, () => {
    console.log(`Payment Gateway API listening on port ${port}`);
});