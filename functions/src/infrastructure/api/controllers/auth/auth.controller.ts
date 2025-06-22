import { Request, Response } from "express";
import { IApiResponse, IErrorResponse } from "../../../../interfaces/api-response.interface";
import { LoginUserUseCase, RegisterUserUseCase } from "../../../../core/use-cases/auth";
import { createAccountCodec } from "./auth.codec";
import { SigninResponseDto } from "./auth.dto";

export class AuthController {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase
  ) {}

  /**
   * @description Registers a new user using their email.
   *
   * @route POST /auth/register
   * @param {Request} req - Express request object containing the body with:
   *   - email: string (required)
   * @param {Response} res - Express response object
   *
   * @return {Promise<void>}
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = createAccountCodec.decode(req.body);

      if (!validationResult.success) {
        const errorResponse: IErrorResponse = {
          success: false,
          message: "Invalid input data",
          error: validationResult.error.errors.map((err) => err.message).join(", "),
        };

        res.status(400).json(errorResponse);
        return;
      }

      const user = await this.registerUserUseCase.execute(validationResult.data);

      if (user === "existing") {
        const errorResponse: IErrorResponse = {
          success: false,
          message: "User already exists",
        };
        res.status(400).json(errorResponse);
        return;
      }

      const response: IApiResponse<SigninResponseDto> = {
        success: true,
        data: user,
        message: "User successfully created",
      };

      res.status(201).json(response);
    } catch (error) {
      const errorResponse: IErrorResponse = {
        success: false,
        message: "Error creating task",
        error: error instanceof Error ? error.message : "Unknown error",
      };

      res.status(500).json(errorResponse);
    }
  }

  /**
   *
   * @description Logs in a user using their email.
   *
   * @route POST /auth/login
   * @param {Request} req - Express request object with:
   *   - email: string (required)
   * @param {Response} res - Returns a JWT token on success
   *
   * @return {Promise<void>}
   */
  async signin(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = createAccountCodec.decode(req.body);

      if (!validationResult.success) {
        const errorResponse: IErrorResponse = {
          success: false,
          message: "Invalid email",
          error: validationResult.error.errors.map((err) => err.message).join(", "),
        };

        res.status(400).json(errorResponse);
        return;
      }

      const user = await this.loginUserUseCase.execute(validationResult.data.email);

      if (user === "no_existing") {
        const errorResponse: IErrorResponse = {
          success: false,
          message: "User not found",
        };

        res.status(400).json(errorResponse);
        return;
      }
    } catch (error) {
      const errorResponse: IErrorResponse = {
        success: false,
        message: "Error siging in",
        error: error instanceof Error ? error.message : "Unknown error",
      };

      res.status(500).json(errorResponse);
    }
  }
}
