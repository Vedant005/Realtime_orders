import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

import orderRouter from "./routes/order.js";

app.use("/api/order", orderRouter);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
  });
});

app.use(express.static("public"));

export default app;
