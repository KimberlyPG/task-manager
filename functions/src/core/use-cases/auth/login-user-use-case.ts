import { UserRepository } from "../../../domain/repositories/TaskRepository";
import { Logger } from "../../ports/logger.port";

class LoginUserUseCase {
  constructor(
    private logger: Logger,
    private userRepository: UserRepository
  ) {}

  async execute(email: string): Promise<{ token: string } | "no_existing"> {
    this.logger.info("LoginUserUseCase.execute");

    const existingUser = await this.userRepository.getByLogin(email);

    return existingUser ? { token: existingUser.signAndEncodeUserAccessToken() } : "no_existing";
  }
}

export default LoginUserUseCase;
