
import * as paymentService from "../services/payments.services";


export const createPayment = async (req: any, res: any) => {
    try {
        console.log('body', req.body)
        const payment = await paymentService.createPayment(req.body);

        const payment_link = "https://dummy.pay.example.com";

        res.status(201).json({ data: "dummy response" })

    } catch (error: any) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};
export const getPayment = async (req: any, res: any) => {
    try {
        const payment = await paymentService.getPayment(req.params.id);
        console.log("get payment>>", payment)
        res.status(200).json({ success: true, payment });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
}
export const updatePayment = async (req: any, res: any) => {
    try {
        const payment = await paymentService.updatePayment(req.params.id, req.body);
        res.status(200).json({ success: true, payment });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
        return;
    }
}

export const deletePayment = async (req: any, res: any) => {
    try {
        const payment = await paymentService.deletePayment(req.params.id);
        res.status(200).json({ success: true, payment });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
        return;
    }
}

