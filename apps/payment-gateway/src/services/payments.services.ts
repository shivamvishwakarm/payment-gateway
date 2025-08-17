import Prisma from "@payment_gateway/db";
import { logger } from "../utils/logger";


export const createPayment = async (data: any) => {




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