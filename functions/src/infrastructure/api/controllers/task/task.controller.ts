import { Request, Response } from "express";
import { Task } from "../../../../domain/entities/Task";
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto, UpdateTaskSchema } from "./task.dto";
import { createTaskCodec, getTaskCodec } from "./task.codec";
import { CreateTaskUseCase, GetTasksUseCase, UpdateTaskUseCase } from "../../../../core/use-cases";
import DeleteTaskUseCase from "../../../../core/use-cases/tasks/delete-task-use-case";
import { GetTaskByIdUseCase } from "../../../../core/use-cases/tasks/get-task-by-id-use-case";
import { IApiResponse, IErrorResponse } from "../../../../interfaces/api-response.interface";

export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly getTaskByIdUseCase: GetTaskByIdUseCase
  ) {}

  private taskToDto(task: Task): TaskResponseDto {
    return {
      id: task.id ?? "",
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt:
        task.createdAt && typeof task.createdAt.toISOString === "function"
          ? task.createdAt.toISOString()
          : new Date(task.createdAt).toISOString(),
      updatedAt:
        task.updatedAt && typeof task.updatedAt.toISOString === "function"
          ? task.updatedAt.toISOString()
          : undefined,
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

      const response: IApiResponse<TaskResponseDto[]> = {
        success: true,
        data: taskDtos,
        count: taskDtos.length,
      };

      res.status(200).json(response);
    } catch (error) {
      const errorResponse: IErrorResponse = {
        success: false,
        message: "Error fetching tasks",
        error: error instanceof Error ? error.message : "Unknown error",
      };

      res.status(500).json(errorResponse);
    }
  }

  /**
   * Create a new task
   *
   * @param {Request} req - Request object with body containing:
   *   - title: string (required)
   *   - description: string (required)
   * @param {Response} res - Response object
   * @return {Promise<void>}
   */
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = createTaskCodec.decodeCreateTask(req.body);

      if (!validationResult.success) {
        const errorResponse: IErrorResponse = {
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

      const response: IApiResponse<TaskResponseDto> = {
        success: true,
        data: this.taskToDto(createdTask),
        message: "Task created successfully",
      };

      res.status(201).json(response);
    } catch (error) {
      const errorResponse: IErrorResponse = {
        success: false,
        message: "Error creating task",
        error: error instanceof Error ? error.message : "Unknown error",
      };

      res.status(500).json(errorResponse);
    }
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const taskIdValidation = getTaskCodec.decodeTaskId(id);
    if (!taskIdValidation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      throw taskIdValidation.error.toString();
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

      const response: IApiResponse<TaskResponseDto> = {
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

    const taskIdValidation = getTaskCodec.decodeTaskId(id);
    if (!taskIdValidation.success) {
      res.status(400).json({
        success: false,
        message: "Task ID is required and must be a valid string",
      });
      throw taskIdValidation.error.toString();
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
}
