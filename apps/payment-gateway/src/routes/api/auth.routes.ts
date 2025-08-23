import express from "express";
import { authController } from "../../controllers/auth.controller";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify-email/:merchantId/:code", authController.verifyEmail);

export default router;