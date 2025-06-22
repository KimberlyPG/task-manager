import { NextFunction, Request, Response } from "express";
import { NewUser } from "../../../core/entities/user.entity";
import container from "../../adapters/adapters.di";

const authRepository = container.resolve("authRepository");

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    _res.status(401).json({
      success: false,
      message: "Missing or invalid token",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const newUser = new NewUser();
    const validateToken = newUser.verifyAndDecoreUserAccessToken(token);
    const user = await authRepository.findById(validateToken.id);

    if (!user) {
      _res.status(401).json({
        success: false,
        message: "Token does not contain subject",
      });
      return;
    }

    (req as Request).userId = user.id;

    next();
    return;
  } catch (err) {
    _res.status(500).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
