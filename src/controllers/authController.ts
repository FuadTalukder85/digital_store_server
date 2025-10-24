import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateReferralCode } from "../utils/referral";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function register(req: Request, res: Response) {
  try {
    const { name, lastName, email, password } = req.body;
    const referralFrom = (req.query.r as string) || null;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    let referralCode = generateReferralCode(name);
    let tries = 0;
    while (await User.findOne({ referralCode })) {
      referralCode = generateReferralCode(name);
      tries++;
      if (tries > 10) break;
    }

    const user = new User({
      name,
      lastName,
      email,
      password: hashed,
      referralCode,
      referredBy: referralFrom,
    });

    await user.save();

    if (referralFrom) {
      const referrer = await User.findOne({ referralCode: referralFrom });
      if (referrer) {
        referrer.referralPoints = (referrer.referralPoints || 0) + 2;
        await referrer.save();
      }
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        referralPoints: user.referralPoints,
        credits: user.credits,
        firstPurchaseDone: user.firstPurchaseDone,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
