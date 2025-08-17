import { Request, Response } from "express";
import * as authService from "../services/auth.services";
import { logger } from "../utils/logger";

export const signup = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const newUser = await authService.signup({ ...data });
        res.status(201).json({ success: true, user: newUser });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};


export const login = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await authService.login(email, password);
        logger.log(accessToken, refreshToken)
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({ success: true, message: "Login successful" });
    } catch (error: any) {
        logger.error(error);
        return res.status(401).json({ success: false, message: error.message });
    }
};