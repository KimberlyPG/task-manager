import { Task } from "../entities/Task";

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(id: string, task: Partial<Task>): Promise<void>;
  delete(id: string): Promise<void>;
}
