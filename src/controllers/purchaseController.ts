import { Response } from "express";
import User from "../models/User";
import Purchase from "../models/Purchase";
import { AuthRequest } from "../middleware/auth";

export async function createPurchase(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const userId = req.user.id;
    const { productId, price } = req.body;

    if (!productId || !price) {
      return res.status(400).json({ message: "productId and price required" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const purchase = new Purchase({
      userId,
      productId,
      price,
    });
    await purchase.save();
    if (!user.firstPurchaseDone) {
      user.firstPurchaseDone = true;
      await user.save();

      if (user.referredBy) {
        const referrer = await User.findOne({ referralCode: user.referredBy });
        if (referrer) {
          referrer.credits = (referrer.credits || 0) + 2;
          await referrer.save();
        }
      }
      return res
        .status(201)
        .json({ message: "Purchase successful. Referrer credited." });
    }
    return res.status(201).json({ message: "Purchase successful." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
