import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import borrowerRoutes from "./routes/borrower.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import loanRoutes from "./routes/loan.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/public", express.static(path.resolve(process.cwd(), "public")));

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "LMS API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/borrower", borrowerRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);

app.use(errorHandler);

export default app;
