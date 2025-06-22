import { Task } from "../../../domain/entities/Task";
import { TaskFirestoreRepository } from "../../../infrastructure/repositories/task-firestore.repository";

class DeleteTaskUseCase {
  constructor(private taskRepository: TaskFirestoreRepository) {}

  async execute(id: string): Promise<Task | null> {
    return await this.taskRepository.delete(id);
  }
}

export default DeleteTaskUseCase;
