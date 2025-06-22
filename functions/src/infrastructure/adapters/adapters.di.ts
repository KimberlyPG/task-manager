// src/di/adapters.di.ts
import { createContainer, asClass } from "awilix";

// Controller
import { TaskController } from "../infrastructure/api/controllers/task/task.controller";
import { TaskFirestoreRepository } from "../repositories/task-firestore.repository";
import {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskByIdUseCase,
  GetTasksUseCase,
  UpdateTaskUseCase,
} from "../../core/use-cases";

const container = createContainer();

container.register({
  // Repositorios
  taskRepository: asClass(TaskFirestoreRepository).singleton(),

  // UseCases
  createTaskUseCase: asClass(CreateTaskUseCase).scoped(),
  getTasksUseCase: asClass(GetTasksUseCase).scoped(),
  updateTaskUseCase: asClass(UpdateTaskUseCase).scoped(),
  deleteTaskUseCase: asClass(DeleteTaskUseCase).scoped(),
  getTaskByIdUseCase: asClass(GetTaskByIdUseCase).scoped(),

  // Controller
  taskController: asClass(TaskController).scoped(),
});

export default container;
