// src/utils/jwt.ts
import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string, email: string) => {
    console.log(process.env.JWT_SECRET)
    return jwt.sign(
        { userid: userId, email: email },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
    );
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign(
        { sub: userId },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
    );
};
export interface AuthPayload {
    id: string;
    email: string;
    role?: string;
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
};
