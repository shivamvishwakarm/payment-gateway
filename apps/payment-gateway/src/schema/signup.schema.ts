
import z from 'zod';


export const signupSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    email: z.string()
        .email('Invalid email format')
        .max(255, 'Email too long')
        .toLowerCase()
        .trim(),
    phone: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
        .transform(phone => phone.replace(/\s+/g, '')), // Remove spaces
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password too long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
    business_type: z.string().optional(),
    country_code: z.string().length(2).default('IN').optional(),
    timezone: z.string().default('Asia/Kolkata').optional(),
});

export type SignupData = z.infer<typeof signupSchema>;