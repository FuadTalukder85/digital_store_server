import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  productId: Number;
  title: string;
  img: string;
  description: string;
  price: number;
  discount: number;
  rate: number;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    productId: { type: Number, required: true },
    title: { type: String, required: true },
    img: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    rate: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
