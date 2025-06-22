import { createContainer, asClass, InjectionMode } from "awilix";

import { TaskController } from "../api/controllers/task/task.controller";
import { TaskFirestoreRepository } from "../repositories/task-firestore.repository";
import {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskByIdUseCase,
  GetTasksUseCase,
  UpdateTaskUseCase,
} from "../../core/use-cases";
import { WinstonLogger } from "./winston-logger/winston-logger.adapter";

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  taskRepository: asClass(TaskFirestoreRepository).singleton(),

  createTaskUseCase: asClass(CreateTaskUseCase).scoped(),
  getTasksUseCase: asClass(GetTasksUseCase).scoped(),
  updateTaskUseCase: asClass(UpdateTaskUseCase).scoped(),
  deleteTaskUseCase: asClass(DeleteTaskUseCase).scoped(),
  getTaskByIdUseCase: asClass(GetTaskByIdUseCase).scoped(),

  taskController: asClass(TaskController).scoped(),
});

container.register({
  logger: asClass(WinstonLogger).singleton(),
});

export default container;
