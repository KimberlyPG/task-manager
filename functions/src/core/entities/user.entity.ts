import { z } from "zod";
import { env } from "process";
import { sign, verify, JwtPayload } from "jsonwebtoken";

const ConfigShema = z.object({
  secret: z.string().min(1, "Secret is required and cannot be empty").trim(),
});

type UserConfig = z.infer<typeof ConfigShema>;

abstract class User {
  protected readonly config: UserConfig;

  constructor() {
    this.config = ConfigShema.parse({
      secret: env["JWT_SECRET"],
    });
  }
}

type ExistingUserConstructorArgs = { id: string };

export class ExistingUser extends User {
  private _id: string;

  constructor({ id }: ExistingUserConstructorArgs) {
    super();
    this._id = id;
  }

  public signAndEncodeUserAccessToken(): string {
    return sign({ sub: this._id }, this.config.secret, { expiresIn: "12h" });
  }

  public get id(): string {
    return this._id;
  }
}

export class NewUser extends User {
  constructor() {
    super();
  }

  public verifyAndDecoreUserAccessToken(token: string): { id: string } {
    try {
      const payload = verify(token, this.config.secret) as JwtPayload; // casteamos
      const sub = payload.sub;
      if (sub && typeof sub === "string") {
        return { id: sub };
      }
      throw new Error("Expected a sub claim");
    } catch (error) {
      console.error("JWT verification failed:", error);
      throw error;
    }
  }
}
