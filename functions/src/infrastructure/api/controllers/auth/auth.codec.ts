import { SigninRequestSchema } from "./auth.dto";

export const createAccountCodec = {
  decode: (params: unknown) => SigninRequestSchema.safeParse(params),
};
