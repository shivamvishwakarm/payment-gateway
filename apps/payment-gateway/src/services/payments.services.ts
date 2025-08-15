import Prisma from "@payment_gateway/db";
import { logger } from "../utils/logger";


export const createPayment = async (data: any) => {
    const {
        merchant_id,
        currency,
        metadata,
        client_secret,
        payment_id,
        payment_link,
        total_amount,
        payment_method,
        status,          // optional
        failure_reason,  // optional

        // 👇 Customer info passed directly (instead of customer_id)
        customer_name,
        customer_email,
        customer_phone
    } = data;

    // ✅ Validate required fields
    if (
        !merchant_id ||
        !currency ||
        !metadata ||
        !client_secret ||
        !payment_id ||
        !payment_link ||
        !total_amount ||
        !payment_method ||
        !customer_name ||
        !customer_email ||
        !customer_phone
    ) {
        throw new Error("Missing required fields for payment or customer.");
    }

    try {
        // 👇 Step 1: Create customer
        const customer = await Prisma.customer.create({
            data: {
                name: customer_name,
                email: customer_email,
                phone: customer_phone
            }
        });

        // 👇 Step 2: Create payment with created customer's ID
        const payment = await Prisma.payment.create({
            data: {
                merchant_id,
                customer_id: customer.id,
                currency,
                metadata,
                client_secret,
                payment_id,
                payment_link,
                total_amount,
                payment_method,
                status,         // optional
                failure_reason  // optional
            }
        });

        return payment;
    } catch (error) {
        console.error("Failed to create payment:", error);
        throw error;
    }
};

export const getPayment = async (id: string) => {

    if (!id) {
        throw new Error("Missing required parameters.");
    }

    const payment = await Prisma.payment.findUnique({
        where: { id },
    });

    if (!payment) {
        throw new Error("Payment not found");
    }

    console.log("get payment", payment);
    return payment;
};


export const updatePayment = async (id: string, data: any) => {
    delete data.merchant_id;

    const isPayment = await Prisma.payment.findUnique({
        where: {
            id: id,
        }
    });

    if (!isPayment) {
        throw new Error("Payment not found");
    }

    const payment = await Prisma.payment.update({
        where: {
            id: id,
        },
        data: {
            ...data,
        },
        include: {
            refund: true,
        }
    });


    return payment;
}

export const deletePayment = async (id: string) => {


    if (!id) {
        throw new Error("Missing required parameters.");
    }

    const isPayment = await Prisma.payment.findUnique({
        where: {
            id: id,
        }
    });

    if (!isPayment) {
        throw new Error("Payment not found");
    }

    const payment = await Prisma.payment.delete({
        where: {
            id: id,
        }
    });

    return payment;

}