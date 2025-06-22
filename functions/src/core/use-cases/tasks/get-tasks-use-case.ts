import { Task } from "../../../domain/entities/Task";
import { TaskFirestoreRepository } from "../../../infrastructure/repositories/task-firestore.repository";

class GetTasksUseCase {
  constructor(private taskRepository: TaskFirestoreRepository) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.getAll();
  }
}

export default GetTasksUseCase;
