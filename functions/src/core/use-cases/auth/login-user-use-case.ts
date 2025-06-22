import { AuthRepository } from "../../../domain/repositories/auth.repository";
import { Logger } from "../../ports/logger.port";

class LoginUserUseCase {
  constructor(
    private userRepository: AuthRepository,
    private logger: Logger
  ) {}

  async execute(email: string): Promise<{ token: string } | "no_existing"> {
    this.logger.info("LoginUserUseCase.execute");

    const existingUser = await this.userRepository.getByEmail(email);

    return existingUser ? { token: existingUser.signAndEncodeUserAccessToken() } : "no_existing";
  }
}

export default LoginUserUseCase;
