
import prisma from "@payment_gateway/db";
import cypto from "crypto";
import bcrypt from "bcrypt";

interface getData {
    merchant_id: string;
    name: string;
    live_mode: boolean;
}

export const getApiKeys = async (data: getData) => {

    const { merchant_id, name, live_mode } = data;

    if (!merchant_id && !name && !live_mode) {

        return new Error("Missing required parameters.");
    }

    const merchant = await prisma.merchant.findFirst({
        where: {
            id: merchant_id,
        }
    });

    if (!merchant) {
        return new Error("Merchant not found.");
    }
    const rawKey = cypto.randomBytes(32).toString('hex');
    const keyHash = await bcrypt.hash(rawKey, 10);

    const apiKey = await prisma.apiKey.create({
        data: { name, live_mode, merchantId: merchant.id, key_hash: keyHash },
    });

    return apiKey;
}


export const deleteApiKey = async (id: string) => {

    if (!id) {
        return new Error("Missing required parameters.");
    }

    const apiKey = await prisma.apiKey.delete({
        where: {
            id: id,
        }
    });

    return apiKey;


}