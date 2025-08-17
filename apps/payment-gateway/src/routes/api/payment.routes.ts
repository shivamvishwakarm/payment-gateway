import express from "express";
import { createPayment, getPayment, updatePayment, deletePayment } from "../../controllers/payments.controller";
import { authenticateApiKey } from "../../middlewares/auth.middleware";
const router = express.Router();


router.post("/", authenticateApiKey, createPayment);


router.patch("/:id", updatePayment);


router.get("/:id", getPayment);

router.delete("/:id", deletePayment);
export default router;