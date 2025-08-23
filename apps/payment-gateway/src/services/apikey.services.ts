
import prisma from "@payment_gateway/db";
import crypto from "crypto";
import bcrypt from "bcrypt";

interface getData {

    name: string;
    live_mode: boolean;
    user: {
        userid: string;
        email: string;
        iat: number;
        exp: number
    }
}


export const createApiKey = async (data: getData) => {
    console.log("data", data.user);

    // const merchant = await prisma.merchant.findFirst({
    //     where: { id: data.user.userid },
    // });

    // if (!merchant) {
    //     throw new Error("Merchant not found.");
    // }

    // const rawKey = `sk_${data.user.userid}_${crypto.randomBytes(32).toString('hex')}`;
    // const keyHash = await bcrypt.hash(rawKey, 10);


    // const apiKeyRecord = await prisma.apiKey.create({
    //     data: {
    //         name: data.name,
    //         live_mode: true,
    //         merchantId: data.user.userid,
    //         key_hash: keyHash,
    //     },
    // });

    // // Return a new object, removing key_hash and adding raw key for user
    // return {
    //     id: apiKeyRecord.id,
    //     name: apiKeyRecord.name,
    //     live_mode: apiKeyRecord.live_mode,
    //     merchantId: apiKeyRecord.merchantId,
    //     created_at: apiKeyRecord.created_at,
    //     updated_at: apiKeyRecord.updated_at,
    //     key: rawKey,  // actual API key user receives
    // };

    return { message: "not implemented" }
};


export const deleteApiKey = async (id: string) => {

    // if (!id) {
    //     return new Error("Missing required parameters.");
    // }

    // const apiKey = await prisma.apiKey.delete({
    //     where: {
    //         id: id,
    //     }
    // });

    // return apiKey;

    return { message: "not implemented" }

}