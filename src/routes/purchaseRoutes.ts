import { Router } from "express";
import { createPurchase } from "../controllers/purchaseController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, createPurchase);

export default router;
