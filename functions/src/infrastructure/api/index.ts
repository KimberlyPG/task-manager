import bodyParser from "body-parser";
import express from "express";

import { authRoutes, taskRoutes } from "../../interfaces/routes";
// import { errorHandlerMiddleware } from "./middlewares/handle-error.middleware";

const app = express();

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
