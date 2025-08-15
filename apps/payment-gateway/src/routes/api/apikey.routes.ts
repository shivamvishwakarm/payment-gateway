import express from "express";
import { get_api_keys, delete_api_key } from "../../controllers/apikey.controller";

const router = express.Router();


router.post("/", get_api_keys);
router.delete("/:id", delete_api_key);

export default router;