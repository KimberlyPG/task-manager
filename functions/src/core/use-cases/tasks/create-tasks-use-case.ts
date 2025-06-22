import { Task } from "../../../domain/entities/Task";
import { TaskRepository } from "../../../domain/repositories/TaskRepository";

interface CreateTaskInput {
  title: string;
  description: string;
  completed?: boolean;
}

class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const task: Task = {
      title: input.title,
      description: input.description,
      completed: input.completed ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.taskRepository.create(task);
  }
}

export default CreateTaskUseCase;
