import express from "express";
const cors = require("cors");
import morgan from "morgan";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import purchaseRoutes from "./routes/purchaseRoutes";

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: "https://digital-store-alpha-umber.vercel.app",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/purchase", purchaseRoutes);

app.get("/", (req, res) => res.send({ message: "Server is running smoothly" }));

export default app;
