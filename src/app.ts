import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send({ message: "Server is running smoothly" }));

export default app;
