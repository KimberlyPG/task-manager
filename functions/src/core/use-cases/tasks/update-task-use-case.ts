import { Task } from "../../../domain/entities/Task";
import { TaskFirestoreRepository } from "../../../infrastructure/repositories/task-firestore.repository";
import { Logger } from "../../ports/logger.port";

class UpdateTaskUseCase {
  constructor(
    private taskRepository: TaskFirestoreRepository,
    private logger: Logger
  ) {}

  async execute(id: string, taskData: Partial<Task>): Promise<Task | null> {
    this.logger.info("UpdateTaskUseCase.execute");

    await this.taskRepository.update(id, taskData);
    return await this.taskRepository.getById(id);
  }
}

export default UpdateTaskUseCase;
