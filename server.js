import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});