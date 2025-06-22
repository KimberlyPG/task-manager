import { Task } from "../../../domain/entities/Task";
import { TaskRepository } from "../../../domain/repositories/TaskRepository";
import { Logger } from "../../ports/logger.port";

export class GetTaskByIdUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private logger: Logger
  ) {}

  async execute(id: string): Promise<Task | null> {
    this.logger.info("GetTaskByIdUseCase.execute");

    return await this.taskRepository.getById(id);
  }
}

export default GetTaskByIdUseCase;
