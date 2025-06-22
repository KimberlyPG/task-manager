import { Router } from "express";
import { TaskController } from "../../infrastructure/api/controllers/task/task.controller";
import { TaskFirestoreRepository } from "../../infrastructure/repositories/task-firestore.repository";
import {
  CreateTaskUseCase,
  GetTasksUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskByIdUseCase,
} from "../../core/use-cases";

const router = Router();

const taskRepo = new TaskFirestoreRepository();
const createTaskUseCase = new CreateTaskUseCase(taskRepo);
const getTasksUseCase = new GetTasksUseCase(taskRepo);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepo);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepo);
const getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepo);

const taskController = new TaskController(
  createTaskUseCase,
  getTasksUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
  getTaskByIdUseCase
);

router.get("/", (req, res) => taskController.getTasks(req, res));
router.post("/", (req, res) => taskController.createTask(req, res));
router.put("/:id", (req, res) => taskController.updateTask(req, res));
router.delete("/:id", (req, res) => taskController.deleteTask(req, res));
router.get("/:id", (req, res) => taskController.getTaskById(req, res));

export default router;
