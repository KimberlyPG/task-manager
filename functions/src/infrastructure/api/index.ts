import bodyParser from "body-parser";
import express from "express";

import config from "./api.config";
import { authRoutes, taskRoutes } from "../../interfaces/routes";

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

const server = app.listen(config.port || 3000, () => {
  console.log(`Listening at http://localhost:${config.port}`);
});
server.on("error", console.error);

export default app;
