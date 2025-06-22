import { ExistingUser } from "../../core/entities/user.entity";
import { Task } from "../entities/Task";

export type CreateUserInput = {
  email: string;
};
export interface TaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(id: string, task: Partial<Task>): Promise<Task | null>;
  delete(id: string): Promise<Task | null>;
}

export interface UserRepository {
  create(user: CreateUserInput): Promise<ExistingUser | "existing">;
  getByLogin(email: string): Promise<ExistingUser | null>;
}
