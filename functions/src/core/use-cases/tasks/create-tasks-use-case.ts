import { Task } from "../../../domain/entities/Task";
import { TaskRepository } from "../../../domain/repositories/task.repository";
import { Logger } from "../../ports/logger.port";

interface CreateTaskInput {
  title: string;
  description: string;
  completed?: boolean;
  userId: string;
}

class CreateTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private logger: Logger
  ) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    this.logger.info("CreateTaskUseCase.execute");

    const task: Task = {
      title: input.title,
      description: input.description,
      completed: input.completed ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: input.userId,
    };

    return await this.taskRepository.create(task);
  }
}

export default CreateTaskUseCase;
