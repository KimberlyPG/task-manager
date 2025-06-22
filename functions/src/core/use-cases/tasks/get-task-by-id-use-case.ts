import { Task } from "../../../domain/entities/Task";
import { TaskRepository } from "../../../domain/repositories/TaskRepository";

export class GetTaskByIdUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string): Promise<Task | null> {
    return await this.taskRepository.getById(id);
  }
}

export default GetTaskByIdUseCase;
