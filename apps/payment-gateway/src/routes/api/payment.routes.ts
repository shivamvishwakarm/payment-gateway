import express from "express";
import { createPayment, getPayment, updatePayment, deletePayment } from "../../controllers/payments.controller";
const router = express.Router();


router.post("/", createPayment);


router.patch("/:id", updatePayment);


router.get("/:id", getPayment);

router.delete("/:id", deletePayment);
export default router;