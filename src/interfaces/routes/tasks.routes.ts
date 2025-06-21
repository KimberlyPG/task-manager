import { Router } from 'express';
import { TaskController } from '../../infrastructure/api/controllers/TaskController';

const router = Router();
const taskController = new TaskController();

// GET /api/tasks - Get all tasks
router.get('/', taskController.getTasks.bind(taskController));

// POST /api/tasks - Add a new task
router.post('/', taskController.createTask.bind(taskController));

// PUT /api/tasks/:id - Update an existing task
router.put('/:id', taskController.updateTask.bind(taskController));

// DELETE /api/tasks/:id - Delete an existing task
router.delete('/:id', taskController.deleteTask.bind(taskController));

export default router;
