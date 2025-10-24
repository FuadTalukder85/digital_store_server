import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

export async function createPurchase(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userId = req.user.id;
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: "amount required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

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

      return res.status(201).json({
        message: "Purchase successful. Referrer credited.",
      });
    } else {
      return res.status(201).json({ message: "Purchase successful." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
