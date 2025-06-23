import { Router } from "express";
import { TaskController } from "../../infrastructure/api/controllers/task/tasks.controller";
import { TaskFirestoreRepository } from "../../infrastructure/repositories/task-firestore.repository";
import {
  CreateTaskUseCase,
  GetTasksUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskByIdUseCase,
} from "../../core/use-cases";
import { WinstonLogger } from "../../infrastructure/adapters/winston-logger/winston-logger.adapter";
import { authMiddleware } from "../../infrastructure/api/middlewares/auth.middleware";
const logger = new WinstonLogger();

const router = Router();

const taskRepo = new TaskFirestoreRepository();
const createTaskUseCase = new CreateTaskUseCase(taskRepo, logger);
const getTasksUseCase = new GetTasksUseCase(taskRepo, logger);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepo, logger);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepo, logger);
const getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepo, logger);

const taskController = new TaskController(
  createTaskUseCase,
  getTasksUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
  getTaskByIdUseCase
);

router.use(authMiddleware);

router.get("/", (req, res) => taskController.getTasks(req, res));
router.post("/", (req, res) => taskController.createTask(req, res));
router.put("/:id", (req, res) => taskController.updateTask(req, res));
router.delete("/:id", (req, res) => taskController.deleteTask(req, res));
router.get("/:id", (req, res) => taskController.getTaskById(req, res));

export default router;
