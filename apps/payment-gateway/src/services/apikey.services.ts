
import prisma from "@payment_gateway/db";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { generateAPIKey } from "../utils/utils";
import { success } from "zod";

interface getData {

    name: string;
    live_mode: boolean;
    user: {
        id: string;
        email: string;

    }
}


export const createApiKey = async (data: getData) => {
    const user = data.user;

    // create a api key
    const prefix = data.name.toLowerCase().replace(/\s+/g, '');

    const { raw: key, hash: key_hash } = generateAPIKey(32, user.id, prefix);


    const apiData = await prisma.apiKey.create({
        data: {
            merchant_id: Number(user.id),
            name: data.name,
            key_hash: key_hash,
            key_prefix: prefix,
            permissions: ["read_payments", "create_payments", "webhooks"],
        },
        select: {
            id: true,
            merchant_id: true,
            name: true,
            key_prefix: true,
        }
    })





    return { api: { key, ...apiData, id: apiData.id.toString(), merchant_id: apiData.merchant_id.toString() }, message: "API key created successfully" }
};


export const deleteApiKey = async (id: string) => {

    const api = await prisma.apiKey.findFirst({
        where: { id: Number(id) },
    })

    if (!api) {
        throw new Error("API key not found");
    }

    await prisma.apiKey.delete({
        where: { id: Number(id) }
    })

    return { message: "API key deleted successfully" }
}


export const getApiKey = async (id: string) => {
    const api = await prisma.apiKey.findFirst({
        where: { id: Number(id) },
        select: {
            id: true,
            key_prefix: true,
            name: true,
        },
    });

    if (!api) {
        throw new Error("API key not found");
    }

    return { ...api, id: api.id.toString() };
};
