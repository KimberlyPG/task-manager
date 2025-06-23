import bodyParser from "body-parser";
import express from "express";
import cors from "cors";

import { authRoutes, taskRoutes } from "../../interfaces/routes";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:4200", "https://task-manager-fe-vq6x.vercel.app"],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running correctly",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);

export default app;
