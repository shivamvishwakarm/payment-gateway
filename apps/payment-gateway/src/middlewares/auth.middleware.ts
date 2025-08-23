import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "@payment_gateway/db";
import bcrypt from "bcrypt";


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.body = { ...req.body, user: decoded }; // Attach user info
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};




export const authenticateApiKey = async (req: Request, res: Response, next: NextFunction) => {
    // const apiKey = req.headers['x-api-key'] as string;
    // if (!apiKey) {
    //     return res.status(401).json({ error: 'Missing API key' });
    // }

    // const merchant_id = apiKey.toString().split("_")[1];

    // const apiKeyRecord = await prisma.apiKey.findFirst({ where: { merchantId: merchant_id } })

    // if (!apiKeyRecord) {
    //     return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    // }

    // const isValid = bcrypt.compareSync(apiKey, apiKeyRecord.key_hash);

    // console.log("isValid", isValid);
    // if (!isValid) {
    //     res.status(401).json({ error: 'unauthorized' });
    // }

    next();

};