import { z } from "zod";

// DTOs for Task API
export const TaskResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  completed: z.boolean(),
  createdAt: z.string(),
});

export type TaskResponseDto = z.infer<typeof TaskResponseSchema>;

export interface ApiResponseDto<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export interface ErrorResponseDto {
  success: false;
  message: string;
  error?: string;
}

export const getTasksSchema = z.array(TaskResponseSchema);

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required and cannot be empty").trim(),
  description: z.string().min(1, "Description is required and cannot be empty").trim(),
  completed: z.boolean().optional(),
});

export const UpdateTaskSchema = z
  .object({
    title: z.string().min(1, "Title cannot be empty").trim().optional(),
    description: z.string().min(1, "Description cannot be empty").trim().optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update (title, description, completed)",
  });

export const TaskIdSchema = z.string().min(1, "Task ID must be a non-empty string");

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;
