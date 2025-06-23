import { createContainer, asClass, InjectionMode } from "awilix";

import { TaskController } from "../api/controllers/task/t.controller";
import { TaskFirestoreRepository } from "../repositories/task-firestore.repository";
import {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskByIdUseCase,
  GetTasksUseCase,
  UpdateTaskUseCase,
} from "../../core/use-cases";
import { WinstonLogger } from "./winston-logger/winston-logger.adapter";
import { AuthFirestoreRepository } from "../repositories/auth-firestore.repository";
import { AuthController } from "../api/controllers/auth/auth.controller";
import { LoginUserUseCase, RegisterUserUseCase } from "../../core/use-cases/auth";

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
  authRepository: asClass(AuthFirestoreRepository).singleton(),

  loginUserUseCase: asClass(LoginUserUseCase).scoped(),
  registerUserUseCase: asClass(RegisterUserUseCase).scoped(),

  authController: asClass(AuthController).scoped(),
});

container.register({
  logger: asClass(WinstonLogger).singleton(),
});

export default container;
