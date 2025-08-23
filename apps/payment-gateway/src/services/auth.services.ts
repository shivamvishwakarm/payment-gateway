
import prisma from "@payment_gateway/db";
import bcrypt from "bcrypt";
import { logger } from "../utils/logger";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { SignupData, signupSchema } from "../schema/signup.schema";
import crypto from "crypto";
import { bigint } from "zod";


export const authService = {
    async signup(data: SignupData) {
        // Validate input
        const validatedData = signupSchema.parse(data);
        const { email, password, name, phone, business_type, country_code, timezone } = validatedData;


        // Check if merchant already exists
        const existingMerchant = await prisma.merchant.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ],
                deleted_at: null // Only check active merchants
            }
        });

        if (existingMerchant) {
            if (existingMerchant.email === email) {
                throw new Error('Email already registered');
            }
            if (existingMerchant.phone === phone) {
                throw new Error('Phone number already registered');
            }
        }

        // Hash password
        const saltRounds = 12; // Increased for better security
        const password_hash = await bcrypt.hash(password, saltRounds);


        // Create merchant with transaction for data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Create merchant
            const merchant = await tx.merchant.create({
                data: {
                    name,
                    email,
                    phone,
                    password_hash,
                    business_type,
                    country_code: country_code || 'IN',
                    timezone: timezone || 'Asia/Kolkata',
                    status: 'PENDING',
                    verification_level: 1,
                    live_mode: false,
                    daily_limit_cents: 10000000, // $100,000 default limit
                    risk_score: 0,
                    last_active_at: new Date(),
                },
                select: {
                    id: true,
                    uuid: true,
                    name: true,
                    email: true,
                    phone: true,
                    status: true,
                    verification_level: true,
                    country_code: true,
                    created_at: true,
                }
            });



            // Create initial analytics record
            await tx.merchantAnalytics.create({
                data: {
                    merchant_id: merchant.id,
                    date: new Date(),
                    currency: 'INR', // Default currency
                    total_payments: 0,
                    successful_payments: 0,
                    failed_payments: 0,
                    total_amount_cents: 0,
                    refunded_amount_cents: 0,
                    success_rate: 0,
                }
            });

            console.log("merchant", merchant);

            return {
                merchant,

            };
        });

        return {
            data: {
                merchant: {
                    ...result.merchant,
                    id: result.merchant.id.toString(), // Convert BigInt to string
                },
                message: 'Merchant created successfully'
            }
        };


    },

    async verifyEmail(merchantUuid: string, verificationCode: string) {

        // Implementation for email verification
        const merchant = await prisma.merchant.findUnique({
            where: { uuid: merchantUuid }
        });

        if (!merchant) {
            throw new Error('Merchant not found');
        }

        // Update verification status
        await prisma.merchant.update({
            where: { uuid: merchantUuid },
            data: {
                status: 'ACTIVE',
                verification_level: 2,
                updated_at: new Date(),
            }
        });

        return { success: true, message: 'Email verified successfully' };
    },




    async login(email: string, password: string) {
        const merchant = await prisma.merchant.findUnique({
            where: {
                email: email.toLowerCase().trim(),
                deleted_at: null
            },
            select: {
                id: true,
                uuid: true,
                name: true,
                email: true,
                phone: true,
                status: true,
                verification_level: true,
                country_code: true,
                password_hash: true,
            }
        });

        if (!merchant) {
            throw new Error('Invalid credentials');
        }

        if (merchant.status === 'BLOCKED' || merchant.status === 'SUSPENDED') {
            throw new Error('Account is suspended. Please contact support.');
        }

        const isValidPassword = await bcrypt.compare(password, merchant.password_hash);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Update last active
        await prisma.merchant.update({
            where: { id: merchant.id },
            data: { last_active_at: new Date() }
        });

        // Don't return sensitive data
        const { password_hash, ...merchantData } = merchant;

        return {
            data: {
                merchant: { ...merchantData, id: merchant.id.toString() },
                message: 'Login successful'
            }
        };
    }
};
