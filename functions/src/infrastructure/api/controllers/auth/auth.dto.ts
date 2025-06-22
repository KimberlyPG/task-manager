import { z } from "zod";

export const SignInResponseSchema = z.object({
  token: z.string().min(1, "Token is required and cannot be empty").trim(),
});
export type SigninResponseDto = z.infer<typeof SignInResponseSchema>;

export const SigninRequestSchema = z.object({
  email: z.string().min(1, "Email is required and cannot be empty").trim(),
});
export type SigninRequestDto = z.infer<typeof SigninRequestSchema>;
