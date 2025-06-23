import { Task } from "../../../domain/entities/Task";
import { TaskFirestoreRepository } from "../../../infrastructure/repositories/task-firestore.repository";
import { Logger } from "../../ports/logger.port";

class DeleteTaskUseCase {
  constructor(
    private taskRepository: TaskFirestoreRepository,
    private logger: Logger
  ) {}

  async execute(id: string): Promise<Task | null> {
    this.logger.info("DeleteTaskUseCase.execute");

    const data = await this.taskRepository.delete(id);

    if (!data) {
      throw new Error("Task not found");
    }

    return data;
  }
}

export default DeleteTaskUseCase;
