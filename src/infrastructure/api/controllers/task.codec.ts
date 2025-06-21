import { TaskIdSchema, CreateTaskSchema } from './dto/task.dto';

export const getTaskCodec = {
    decodeTaskId: (params: unknown) => TaskIdSchema.safeParse(params),
}

export const createTaskCodec = {
    decodeCreateTask: (body: unknown) => CreateTaskSchema.safeParse(body),
}