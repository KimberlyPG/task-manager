import { TaskIdSchema, CreateTaskSchema } from "./task.dto";

export const getTaskCodec = {
  decodeTaskId: (params: unknown) => TaskIdSchema.safeParse(params),
};

export const createTaskCodec = {
  decodeCreateTask: (body: unknown) => CreateTaskSchema.safeParse(body),
};
