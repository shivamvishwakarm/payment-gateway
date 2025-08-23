
import * as paymentService from "../services/payments.services";


export const createPayment = async (req: any, res: any) => {
    try {
        console.log('body>>>', req.body)
        // const payment = await paymentService.createPayment(req.body);

        const payment = await paymentService.createPayment(req.body);

        console.log("payment", payment);
        res.status(201).json({ data: payment })

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

        console.log("req.body", req.body);
        console.log("req.params.id", req.params.id);


        // Todo: Ideally should call acquiring bank for completing the forward money transfer.
        /**
         * if the acquiring bank is giving status code 200 \
         * then we'll call the user webhook and\
         *  update the status complete to the Db.
         */

        // for not we are mocking the things
        const status = "COMPLETED";

        const payment = await paymentService.updatePayment(req.params.id, { status });

        res.status(200).json({ success: true });
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

