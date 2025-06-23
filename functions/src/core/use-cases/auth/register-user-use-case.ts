import { AuthRepository } from "../../../domain/repositories/auth.repository";
import { Logger } from "../../ports/logger.port";

type RegisterUserInput = {
  email: string;
};

class RegisterUserUseCase {
  constructor(
    private userRepository: AuthRepository,
    private logger: Logger
  ) {}

  async execute({ email }: RegisterUserInput): Promise<{ token: string } | "existing"> {
    this.logger.info("RegisterUserUseCase.execute");

    const existingUser = await this.userRepository.create({ email });

    if (existingUser === "existing") {
      return existingUser;
    }

    return {
      token: existingUser.signAndEncodeUserAccessToken(),
    };
  }
}

export default RegisterUserUseCase;
