import { db } from "../adapters/firebase/firebase.admin";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { ExistingUser } from "../../core/entities/user.entity";

export class AuthFirestoreRepository implements AuthRepository {
  private collection = db.collection("users");

  async getByEmail(email: string): Promise<ExistingUser | null> {
    const snapshot = await this.collection.where("email", "==", email).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return new ExistingUser({ id: doc.id });
  }

  async create({ email }: { email: string }): Promise<ExistingUser | "existing"> {
    const snapshot = await this.collection.where("email", "==", email).limit(1).get();

    if (!snapshot.empty) {
      return "existing";
    }
    const docRef = await this.collection.add({
      email,
      createdAt: new Date(),
    });

    if (!docRef.id) {
      throw new Error("Could not create user");
    }
    return new ExistingUser({ id: docRef.id });
  }
}
