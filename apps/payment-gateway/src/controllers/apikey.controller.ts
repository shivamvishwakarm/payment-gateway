
import * as apiService from "../services/apikey.services";


export const get_api_keys = async (req: any, res: any) => {
    try {
        const apiKey = await apiService.createApiKey(req.body)
        return res.status(200).json({ success: true, apiKey });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
}


export const delete_api_key = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const apiKey = await apiService.deleteApiKey(id)
        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
}