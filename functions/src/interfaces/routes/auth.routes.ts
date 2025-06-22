import { Router } from "express";
import { LoginUserUseCase, RegisterUserUseCase } from "../../core/use-cases/auth";
import { WinstonLogger } from "../../infrastructure/adapters/winston-logger/winston-logger.adapter";
import { AuthController } from "../../infrastructure/api/controllers/auth/auth.controller";
import { AuthFirestoreRepository } from "../../infrastructure/repositories/auth-firestore.repository";
const logger = new WinstonLogger();

const router = Router();

const authRepo = new AuthFirestoreRepository();
const loginUserUseCase = new LoginUserUseCase(authRepo, logger);
const registerUserUseCase = new RegisterUserUseCase(authRepo, logger);

const authController = new AuthController(loginUserUseCase, registerUserUseCase);

router.post("/sessions", (req, res) => authController.register(req, res));
router.post("/users", (req, res) => authController.signin(req, res));

export default router;
