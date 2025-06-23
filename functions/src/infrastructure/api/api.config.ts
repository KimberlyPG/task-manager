import { env } from "node:process";

export default {
  env: env["NODE_ENV"],
  port: env["APP_PORT"],
  secret: env["JWT_SECRET"],
};
