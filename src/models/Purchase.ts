import { Schema, model, Document } from "mongoose";

export interface IPurchase extends Document {
  userId: string;
  productId: string;
  price: number;
  createdAt: Date;
}

const purchaseSchema = new Schema<IPurchase>({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<IPurchase>("Purchase", purchaseSchema);
