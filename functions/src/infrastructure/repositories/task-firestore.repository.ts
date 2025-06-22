import { firestore } from "../adapters/firebase/firebase.admin";
import { Task } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class TaskFirestoreRepository implements TaskRepository {
  private collection = firestore.collection("tasks");

  async getAll(): Promise<Task[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Task);
  }

  async getById(id: string): Promise<Task | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Task;
  }

  async create(task: Omit<Task, "id">): Promise<Task> {
    const { title, description, completed } = task;
    const docRef = await this.collection.add({
      title,
      description,
      completed,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...task };
  }

  async update(id: string, task: Partial<Task>): Promise<void> {
    await this.collection.doc(id).update({
      ...task,
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
