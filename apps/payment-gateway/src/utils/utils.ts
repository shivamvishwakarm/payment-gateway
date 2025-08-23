
import crypto from "crypto";


export const generateAPIKey = (length: number, id: string, prefix: string) => {
    const rawKey = crypto.randomBytes(length).toString('hex').slice(0, length);
    const raw = `${prefix}_${id}_${rawKey}`;

    const hash = crypto.createHash('sha256').update(raw).digest('hex');

    return { raw, hash };
};
