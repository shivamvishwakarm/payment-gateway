import { Request, Response } from "express";
import authRouter from "./routes/api/auth.routes";
import apiKeyRouter from "./routes/api/apikey.routes";
import paymentRouter from "./routes/api/payment.routes";
import 'dotenv/config'
import express = require('express');


var app = express();
const port = 3000;

// Middleware: JSON parser
app.use(express.json());

// Middleware: Authentication placeholder
app.use((req: Request, res: Response, next: Function) => {
    // TODO: Implement authentication check
    // Example: verify JWT token from headersx
    next();
});


app.use("/auth", authRouter);
app.use("/api-keys", apiKeyRouter);
app.use("/payments", paymentRouter);

/**
 * Root endpoint - Health check
 */
app.get('/', (req: Request, res: Response) => {
    res.send('Payment Gateway API is running.');
});



/**
 * POST /payments
 * Step-by-step:
 * 1. Destructure payment details from request body.
 * 2. Validate payment details.
 * 3. Save transaction in database.
 * 4. Generate client_secret, payment_id, and payment_link.
 * 5. Return response object.
 */
app.post('/payments', (req: Request, res: Response) => {
    const {
        billing,
        customer,
        product_cart,
        billing_currency,
        customer_details
    } = req.body;

    // TODO: 1. Validate details (required fields, correct format)
    // TODO: 2. Save to DB
    // TODO: 3. Generate payment metadata

    const payment_id = "pay_" + Date.now();
    const client_secret = "secret_" + Math.random().toString(36).substring(2);
    const payment_link = `https://yourgateway.com/pay/${payment_id}`;

    res.json({
        client_secret,
        customer: customer_details || {},
        expires_on: new Date(new Date().getTime() + 15 * 60 * 1000).toISOString(), // 15 mins expiry
        payment_id,
        payment_link,
        product_cart,
        total_amount: product_cart?.reduce((sum: number, p: any) => sum + (p.amount * p.quantity), 0) || 0
    });
});

app.listen(port, () => {
    console.log(`Payment Gateway API listening on port ${port}`);
});