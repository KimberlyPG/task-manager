import { Task } from "../entities/Task";

export interface TaskRepository {
  getAll(userId: string): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(id: string, task: Partial<Task>): Promise<Task | null>;
  delete(id: string): Promise<Task | null>;
}
