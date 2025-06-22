import { Request, Response } from "express";
import { Task } from "../../../../domain/entities/Task";
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto,
  ApiResponseDto,
  ErrorResponseDto,
  UpdateTaskSchema,
  TaskIdSchema,
} from "./task.dto";
import { createTaskCodec, getTaskCodec } from "./task.codec";
import { CreateTaskUseCase, GetTasksUseCase, UpdateTaskUseCase } from "../../../../core/use-cases";
import DeleteTaskUseCase from "../../../../core/use-cases/tasks/delete-task-use-case";
import { GetTaskByIdUseCase } from "../../../../core/use-cases/tasks/get-task-by-id-use-case";

export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly getTaskByIdUseCase: GetTaskByIdUseCase
  ) {
    console.log("TaskController constructor");
  }

  private taskToDto(task: Task): TaskResponseDto {
    return {
      id: task.id ?? "",
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt?.toISOString(),
    };
  }

  /**
   * Get tasks list
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @return {Promise<void>}
   */
  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.getTasksUseCase.execute();
      const taskDtos = tasks.map((task) => this.taskToDto(task));

      const response: ApiResponseDto<TaskResponseDto[]> = {
        success: true,
        data: taskDtos,
        count: taskDtos.length,
      };

      res.status(200).json(response);
    } catch (error) {
      const errorResponse: ErrorResponseDto = {
        success: false,
        message: "Error fetching tasks",
        error: error instanceof Error ? error.message : "Unknown error",
      };

      res.status(500).json(errorResponse);
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = createTaskCodec.decodeCreateTask(req.body);

      if (!validationResult.success) {
        const errorResponse: ErrorResponseDto = {
          success: false,
          message: "Invalid input data",
          error: validationResult.error.errors.map((err) => err.message).join(", "),
        };

        res.status(400).json(errorResponse);
        return;
      }

      const createTaskDto: CreateTaskDto = validationResult.data;

      const createdTask = await this.createTaskUseCase.execute({
        title: createTaskDto.title,
        description: createTaskDto.description,
        completed: false,
      });

      const response: ApiResponseDto<TaskResponseDto> = {
        success: true,
        data: this.taskToDto(createdTask),
        message: "Task created successfully",
      };

      res.status(201).json(response);
    } catch (error) {
      const errorResponse: ErrorResponseDto = {
        success: false,
        message: "Error creating task",
        error: error instanceof Error ? error.message : "Unknown error",
      };

      res.status(500).json(errorResponse);
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const taskIdValidation = getTaskCodec.decodeTaskId(id);
    if (!taskIdValidation.success) {
      res.status(400).json({
        success: false,
        message: "Task ID is required and must be a valid number",
      });
      return;
    }

    const bodyValidationResult = UpdateTaskSchema.safeParse(req.body);
    if (!bodyValidationResult.success) {
      res.status(400).json({
        success: false,
        message: "Invalid input data",
        error: bodyValidationResult.error.errors.map((e) => e.message).join(", "),
      });
      return;
    }

    try {
      const updateTaskDto: UpdateTaskDto = bodyValidationResult.data;

      const updatedTask = await this.updateTaskUseCase.execute(id, updateTaskDto);

      if (!updatedTask) {
        res.status(404).json({
          success: false,
          message: "Task not found",
        });
        return;
      }

      const response: ApiResponseDto<TaskResponseDto> = {
        success: true,
        data: this.taskToDto(updatedTask),
        message: "Task updated successfully",
      };

      res.status(200).json(response);
      return;
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating task",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return;
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const idValidation = TaskIdSchema.safeParse(id);
    if (!idValidation.success) {
      res.status(400).json({
        success: false,
        message: "Task ID is required and must be a valid string",
      });
      return;
    }

    try {
      const deletedTask = await this.deleteTaskUseCase.execute(id);

      if (!deletedTask) {
        res.status(404).json({
          success: false,
          message: "Task not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: this.taskToDto(deletedTask),
        message: `Task "${deletedTask.title}" deleted successfully`,
      });
      return;
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting task",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return;
    }
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const validation = TaskIdSchema.safeParse(id);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      return;
    }

    try {
      const task = await this.getTaskByIdUseCase.execute(id);

      if (!task) {
        res.status(404).json({
          success: false,
          message: "Task not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: this.taskToDto(task),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching task",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
