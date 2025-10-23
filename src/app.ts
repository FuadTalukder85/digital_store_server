import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Digital Store Referral API is running"));

export default app;
