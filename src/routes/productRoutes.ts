import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/", authMiddleware, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
