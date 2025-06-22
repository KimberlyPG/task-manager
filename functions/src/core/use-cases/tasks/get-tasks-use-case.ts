import { Task } from "../../../domain/entities/Task";
import { TaskFirestoreRepository } from "../../../infrastructure/repositories/task-firestore.repository";
import { Logger } from "../../ports/logger.port";

class GetTasksUseCase {
  constructor(
    private taskRepository: TaskFirestoreRepository,
    private logger: Logger
  ) {}

  async execute(userId: string): Promise<Task[]> {
    this.logger.info("GetTasksUseCase.execute");

    return this.taskRepository.getAll(userId);
  }
}

export default GetTasksUseCase;
