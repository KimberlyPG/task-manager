import { z } from "zod";
import { env } from "process";
import { sign, verify } from "jsonwebtoken";

const ConfigShema = z.object({
  secret: z.string().min(1, "Secret is required and cannot be empty").trim(),
});

type UserConfig = z.infer<typeof ConfigShema>;

abstract class User {
  protected readonly config: UserConfig;

  constructor() {
    this.config = ConfigShema.parse({
      secret: env["JWT_SECRET"],
      salt: env["USER_SALT"],
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
    const { sub } = verify(token, this.config.secret);
    if (sub && typeof sub === "string") {
      return { id: sub };
    }
    throw new Error("Expected a sub claim");
  }
}
