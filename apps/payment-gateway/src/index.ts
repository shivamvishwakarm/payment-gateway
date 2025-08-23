import { Request, Response } from "express";
import authRouter from "./routes/api/auth.routes";
import apiKeyRouter from "./routes/api/apikey.routes";
import paymentRouter from "./routes/api/payment.routes";
import 'dotenv/config'
import express = require('express');
import cookieParser from "cookie-parser";
import { authenticate } from "./middlewares/auth.middleware";
import cors from "cors";


var app = express();
const port = 3000;

// Middleware: JSON parser
app.use(express.json());
app.use(cookieParser())

app.use(cors());

// cors domain whitelist

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
    methods: ["POST"],
}));


app.use("/auth", authRouter);
app.use("/api-keys", authenticate, apiKeyRouter);
app.use("/payments", paymentRouter);




/**
 * Root endpoint - Health check
*/

app.head('/', (req: Request, res: Response) => {
    res.send('Payment Gateway API is running.');
});



app.listen(port, () => {
    console.log(`Payment Gateway API listening on port ${port}`);
});