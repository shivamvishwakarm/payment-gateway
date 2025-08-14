"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@payment_gateway/db/src/index");
const express = require('express');
const app = express();
const port = 3000;
// Middleware: JSON parser
app.use(express.json());
// Middleware: Authentication placeholder
app.use((req, res, next) => {
    // TODO: Implement authentication check
    // Example: verify JWT token from headers
    next();
});
/**
 * Root endpoint - Health check
 */
app.get('/', (req, res) => {
    res.send('Payment Gateway API is running.');
});
/**
 * GET /api_keys
 * Step-by-step:
 * 1. Check if the user is authenticated.
 * 2. Extract `business_id`, `name`, and `live_mode` from request body.
 * 3. Validate the request data.
 * 4. Fetch API key details from the database.
 * 5. Return in the format:
 *    {
 *      api_key: "<string>",
 *      api_key_id: "<string>",
 *      business_id: "<string>",
 *      created_at: "<ISO Date>",
 *      expires_at: "<ISO Date>",
 *      live_mode: <boolean>,
 *      name: "<string>"
 *    }
 */
app.get('/api_keys', (req, res) => {
    const { business_id, name, live_mode } = req.body;
    // TODO: 1. Validate inputs
    // TODO: 2. Fetch API key from DB
    // TODO: 3. Return formatted response
    res.json({
        api_key: "QC0WKnLP",
        api_key_id: "QC0WKnLPmTowo_5V",
        business_id: business_id || "bus_iaFGunRnnm6iZ1b9Ax3MO",
        created_at: new Date().toISOString(),
        expires_at: new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString(),
        live_mode: live_mode !== null && live_mode !== void 0 ? live_mode : false,
        name: name || "test2"
    });
});
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, phone, business_id } = req.body;
    // TODO: 1. Validate inputs
    // TODO: 2. Create a new merchant
    // TODO: 3. Return formatted response
    const merchant = yield index_1.default.merchant.create({
        data: {
            email,
            name,
            password,
            phone,
            live_mode: false,
        },
    });
    console.log(merchant);
    res.send({
        status: "success",
    });
}));
/**
 * POST /login
 * Step-by-step:
 * 1. Get `email` and `password` from request body.
 * 2. Validate credentials against database.
 * 3. Generate & return authentication token.
 */
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const merchant = yield index_1.default.merchant.findFirst({
        where: {
            email: email
        }
    });
    // TODO: 1. Validate credentials from DB
    // TODO: 2. Generate JWT token
    // TODO: 3. Return token in response
    res.json({ token: "sample-auth-token" });
}));
/**
 * POST /payments
 * Step-by-step:
 * 1. Destructure payment details from request body.
 * 2. Validate payment details.
 * 3. Save transaction in database.
 * 4. Generate client_secret, payment_id, and payment_link.
 * 5. Return response object.
 */
app.post('/payments', (req, res) => {
    const { billing, customer, product_cart, billing_currency, customer_details } = req.body;
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
        total_amount: (product_cart === null || product_cart === void 0 ? void 0 : product_cart.reduce((sum, p) => sum + (p.amount * p.quantity), 0)) || 0
    });
});
app.listen(port, () => {
    console.log(`Payment Gateway API listening on port ${port}`);
});
