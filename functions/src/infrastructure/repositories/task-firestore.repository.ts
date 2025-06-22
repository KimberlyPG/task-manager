import { db } from "../adapters/firebase/firebase.admin";
import { Task } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class TaskFirestoreRepository implements TaskRepository {
  private collection = db.collection("tasks");

  async getAll(): Promise<Task[]> {
    const snapshot = await this.collection.get();

    const tasks: Task[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        createdAt: data.createdAt?.toDate
          ? new Date(data.createdAt.toDate())
          : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate
          ? new Date(data.updatedAt.toDate())
          : new Date(data.updatedAt),
      };
    });

    return tasks;
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

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    await this.collection.doc(id).update({
      ...task,
      updatedAt: new Date(),
    });

    const updatedDoc = await this.collection.doc(id).get();
    if (!updatedDoc.exists) return null;

    return { id: updatedDoc.id, ...updatedDoc.data() } as Task;
  }

  async delete(id: string): Promise<Task | null> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    await docRef.delete();

    const data = doc.data();

    if (!data) return null;

    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
    };
  }
}
