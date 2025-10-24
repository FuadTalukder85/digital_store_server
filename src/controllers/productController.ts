import { Request, Response } from "express";
import Product from "../models/Product";

const generateProductId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
// Create product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, img, description, price, discount, rate } = req.body;
    if (
      !title ||
      !img ||
      !description ||
      price == null ||
      discount == null ||
      rate == null
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let productId = generateProductId();
    // check unique id in db
    let existing = await Product.findOne({ productId });
    while (existing) {
      productId = generateProductId();
      existing = await Product.findOne({ productId });
    }

    const product = new Product({
      productId,
      title,
      img,
      description,
      price,
      discount,
      rate,
    });
    await product.save();

    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
