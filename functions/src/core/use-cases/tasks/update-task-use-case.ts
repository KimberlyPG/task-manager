import { Task } from "../../../domain/entities/Task";
import { TaskFirestoreRepository } from "../../../infrastructure/repositories/task-firestore.repository";

class UpdateTaskUseCase {
  constructor(private taskRepository: TaskFirestoreRepository) {}

  async execute(id: string, taskData: Partial<Task>): Promise<Task | null> {
    await this.taskRepository.update(id, taskData);
    return await this.taskRepository.getById(id);
  }
}

export default UpdateTaskUseCase;
