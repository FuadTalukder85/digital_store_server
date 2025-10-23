import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  referralCode: string;
  referredBy?: string | null;
  referralPoints: number;
  credits: number;
  firstPurchaseDone: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: String, default: null },
  referralPoints: { type: Number, default: 0 },
  credits: { type: Number, default: 0 },
  firstPurchaseDone: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default model<IUser>("User", userSchema);
