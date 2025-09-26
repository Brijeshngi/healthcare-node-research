import express from "express";
// import labRoutes from "./routes/labRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userroutes from "./routes/userRoutes.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
// app.use("/labs", labRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userroutes);

// Error middlewares
app.use(errorMiddleware);

export default app;
