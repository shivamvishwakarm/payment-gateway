
import Prisma from "@payment_gateway/db";
import bcrypt from "bcrypt";
import { logger } from "../utils/logger";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";


export const signup = async (data: any) => {
    const { email, password, name, phone } = data;

    const hashedPassword = await bcrypt.hash(password, 10);
    const merchant = await Prisma.merchant.create({
        data: {
            email,
            name,
            password: hashedPassword,
            phone,
            live_mode: false,
        },
    })

    return { data: merchant };
};

export const login = async (email: string, password: string) => {
    const merchant = await Prisma.merchant.findFirst({ where: { email } });

    if (!merchant) {
        logger.warn(`Login failed: user ${email} not found`);
        throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(password, merchant.password);

    if (!isPasswordValid) {
        logger.warn(`Login failed: incorrect password for ${email}`);
        throw new Error("Invalid email or password.");
    }

    // Optional: Check if MFA is enabled here and return early
    // if (merchant.mfaEnabled) return { mfaRequired: true };

    const accessToken = generateAccessToken(merchant.id, merchant.email);
    const refreshToken = generateRefreshToken(merchant.id);

    // Optional: Save refresh token in DB for rotation/invalidation
    // await Prisma.refrshToken.create({
    //     data: {
    //         token: refreshToken,
    //         merchantId: merchant.id,
    //     },
    // });

    return { accessToken, refreshToken };
};