import Prisma from "@payment_gateway/db";
import { nanoid } from "nanoid"; // for secure ID generation

// You might store this in an env variable
const BASE_PAYMENT_URL = process.env.BASE_PAYMENT_URL || "http://127.0.0.1:5500/apps/payment-ui/index.html";

export const createPayment = async (data: any) => {
    // console.log("data", data);
    // try {
    //     // Step 1: Generate a secure client secret and unique ID
    //     const clientSecret = nanoid(32);
    //     const paymentId = nanoid(12); // short ID for user display, not the DB id

    //     // Step 2: Create payment link
    //     const paymentLink = `${BASE_PAYMENT_URL}/${paymentId}`;

    //     // Step 3: Insert payment record
    //     const payment = await Prisma.payment.create({
    //         data: {
    //             merchant: {
    //                 connect: {
    //                     id: data.merchant_id,
    //                 }
    //             },
    //             currency: data.currency,
    //             paymentMethod: data.payment_method,
    //             totalAmount: data.total_amount,
    //             clientSecret: data.client_secret,
    //             metadata: data.metadata || {},
    //             status: "PENDING",
    //             paymentLink: paymentLink,
    //             failureReason: null,
    //         }
    //     });




    //     const orderRecord = await Prisma.order.create({
    //         data: {
    //             merchant: {
    //                 connect: {
    //                     id: data.merchant_id
    //                 },
    //             },
    //             customer: {
    //                 create: {
    //                     id: data.customer_id,
    //                     name: data.customer_name,
    //                     email: data.customer_email,
    //                     phone: data.customer_phone,
    //                 },
    //             },
    //             payments: {
    //                 connect: [{ id: payment.id }],
    //             },
    //         },
    //     });

    //     const paymentLinkRecord = await Prisma.paymentLink.create({
    //         data: {
    //             orderId: data.orderId,
    //             order: {
    //                 connect: {
    //                     id: orderRecord.id,
    //                 },
    //             },
    //             url: `${BASE_PAYMENT_URL}/${payment.id}`,
    //             expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 1 / 4 * 1), // 7 days
    //             status: "PENDING",
    //             amount: data.total_amount,
    //             currency: data.currency,
    //             metadata: data.metadata,
    //         },
    //     });


    //     console.log("payment id", payment.id);
    //     const link = `${BASE_PAYMENT_URL}?id=${payment.id}`;
    //     return {
    //         success: true,
    //         paymentId: payment.id,
    //         link,
    //         clientSecret,
    //     };
    // } catch (error) {
    //     console.error("Error creating payment:", error);
    //     return {
    //         success: false,
    //         error: "Unable to create payment",
    //     };
    // }

    return {
        message: "not implemented"
    }
};









export const getPayment = async (id: string) => {

    // if (!id) {
    //     throw new Error("Missing required parameters.");
    // }
    // console.log("id", id);

    // const payment = await Prisma.payment.findFirst({
    //     where: { id },
    // });

    // console.log("payment", payment);
    // if (!payment) {
    //     throw new Error("Payment not found");
    // }

    // console.log("get payment", payment);
    // return payment;
};


export const updatePayment = async (id: string, data: any) => {
    // delete data.merchant_id;

    // const isPayment = await Prisma.payment.findUnique({
    //     where: {
    //         id: id,
    //     }
    // });

    // if (!isPayment) {
    //     throw new Error("Payment not found");
    // }

    // const payment = await Prisma.payment.update({
    //     where: {
    //         id: id,
    //     },
    //     data: {
    //         status: data.status,
    //     },

    // });


    // return payment;

    return {
        message: "not implemented"
    }

}

export const deletePayment = async (id: string) => {


    // if (!id) {
    //     throw new Error("Missing required parameters.");
    // }

    // const isPayment = await Prisma.payment.findUnique({
    //     where: {
    //         id: id,
    //     }
    // });

    // if (!isPayment) {
    //     throw new Error("Payment not found");
    // }

    // const payment = await Prisma.payment.delete({
    //     where: {
    //         id: id,
    //     }
    // });

    // return payment;

    return {
        message: "not implemented"
    }

}