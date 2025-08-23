import express from "express";
import { createAPIKey, getApiKey, deleteApiKey } from "../../controllers/apikey.controller";

const router = express.Router();


router.post("/", createAPIKey);
router.delete("/:id", deleteApiKey);
router.get("/:id", getApiKey);

export default router;