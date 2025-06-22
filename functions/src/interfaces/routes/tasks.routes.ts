import { Router } from "express";
import container from "../../infrastructure/adapters/adapters.di";

const router = Router();

const taskController = container.resolve("taskController");

router.get("/", (req, res) => taskController.getTasks(req, res));
router.post("/", (req, res) => taskController.createTask(req, res));
router.put("/:id", (req, res) => taskController.updateTask(req, res));
router.delete("/:id", (req, res) => taskController.deleteTask(req, res));
router.get("/:id", (req, res) => taskController.getTaskById(req, res));

export default router;
