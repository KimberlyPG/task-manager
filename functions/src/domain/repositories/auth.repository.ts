import { ExistingUser } from "../../core/entities/user.entity";

export type CreateUserInput = {
  email: string;
};
export interface AuthRepository {
  create(user: CreateUserInput): Promise<ExistingUser | "existing">;
  getByEmail(email: string): Promise<ExistingUser | null>;
}
