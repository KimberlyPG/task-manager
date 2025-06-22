import { Task } from "../../../domain/entities/Task";
import { TaskFirestoreRepository } from "../../../infrastructure/repositories/task-firestore.repository";
import { Logger } from "../../ports/logger.port";

class GetTasksUseCase {
  constructor(
    private taskRepository: TaskFirestoreRepository,
    private logger: Logger
  ) {}

  async execute(): Promise<Task[]> {
    this.logger.info("GetTasksUseCase.execute");

    return this.taskRepository.getAll();
  }
}

export default GetTasksUseCase;
