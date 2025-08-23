
import * as apiService from "../services/apikey.services";


export const createAPIKey = async (req: any, res: any) => {
    try {

        const data = await apiService.createApiKey({ ...req.body, user: req.user })
        return res.status(200).json({ success: true, ...data });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
}


export const deleteApiKey = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        await apiService.deleteApiKey(id)
        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
}


export const getApiKey = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const apiData = await apiService.getApiKey(id)
        res.status(200).json({ success: true, data: apiData });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
}