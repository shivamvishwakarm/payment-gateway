import { Request, Response } from "express";
import { authService } from "../services/auth.services";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const authController = {
    signup: async (req: Request, res: Response) => {
        try {
            // Extract and validate request data
            const data = req.body;

            // Additional server-side validation
            if (!data.email || !data.password || !data.name || !data.phone) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields',
                    required: ['email', 'password', 'name', 'phone']
                });
            }

            // Create merchant
            const result = await authService.signup(data);

            // Log successful signup (for monitoring)
            console.log(`New merchant signup: ${result.data.merchant.email}`);

            res.status(201).json({
                success: true,
                data: result.data,
                message: 'Account created successfully'
            });

        } catch (error: any) {
            // Log error for monitoring
            console.error('Signup error:', {
                message: error.message,
                email: req.body?.email,
                timestamp: new Date().toISOString()
            });

            // Handle validation errors
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: error.errors.map((e: any) => ({
                        field: e.path.join('.'),
                        message: e.message
                    }))
                });
            }

            // Handle Prisma errors
            if (error.code === 'P2002') {
                const field = error.meta?.target?.[0] || 'field';
                return res.status(409).json({
                    success: false,
                    error: `${field} already exists`,
                    message: 'This email or phone number is already registered'
                });
            }

            // Generic error response
            res.status(400).json({
                success: false,
                error: 'Registration failed',
                message: error.message || 'An unexpected error occurred'
            });
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Email and password are required'
                });
            }

            const result = await authService.login(email, password);

            // create access token
            const accessToken = generateAccessToken(result.data.merchant.id, result.data.merchant.email);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

            // create refresh token
            const refreshToken = generateRefreshToken(result.data.merchant.id);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json({
                success: true,
                data: result.data
            });

        } catch (error: any) {
            console.error('Login error:', {
                message: error.message,
                email: req.body?.email,
                timestamp: new Date().toISOString()
            });

            res.status(401).json({
                success: false,
                error: 'Authentication failed',
                message: error.message
            });
        }
    },

    verifyEmail: async (req: Request, res: Response) => {
        try {

            const { merchantId, code } = req.params;

            // warning: the code is mocked and not being used
            const result = await authService.verifyEmail(merchantId, code);

            res.status(200).json({
                success: true,
                message: result.message
            });

        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: 'Verification failed',
                message: error.message
            });
        }
    }
};