import { Router } from "express";
import { TaskController } from "../../infrastructure/api/controllers/task/Task.controller";

const router = Router();
const taskController = new TaskController();

/**
 * @route GET /tasks
 * @description Get all tasks for the current user
 * @returns {TaskResponseDto[]} 200 - List of tasks
 */
router.get("/", taskController.getTasks.bind(taskController));

/**
 * @route POST /tasks
 * @description Create a new task
 * @body { title: string, description: string }
 * @returns {TaskResponseDto} 201 - Task created
 */
router.post("/", taskController.createTask.bind(taskController));

/**
 * @route PUT /tasks/:id
 * @description Update an existing task by ID
 * @param {string} id.path.required - task ID
 * @body { title?: string, description?: string, completed?: boolean }
 * @returns {TaskResponseDto} 200 - Task updated
 */
router.put("/:id", taskController.updateTask.bind(taskController));

/**
 * @route DELETE /tasks/:id
 * @description Delete a task by ID
 * @param {string} id.path.required - task ID
 * @returns {TaskResponseDto} 200 - Task deleted
 */
router.delete("/:id", taskController.deleteTask.bind(taskController));

export default router;
