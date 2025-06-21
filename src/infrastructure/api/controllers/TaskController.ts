import { Request, Response } from 'express';
import { Task } from '../../../domain/entities/Task';
import { 
  CreateTaskDto, 
  UpdateTaskDto, 
  TaskResponseDto, 
  ApiResponseDto, 
  ErrorResponseDto,
  CreateTaskSchema,
  UpdateTaskSchema,
  TaskIdSchema
} from './dto/task.dto';
import { get } from 'http';
import { createTaskCodec, getTaskCodec } from './task.codec';

export class TaskController {
  private tasks: Task[] = [];
  private nextId: number = 1;

  constructor() {}

  private taskToDto(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt.toISOString()
    };
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const taskDtos = this.tasks.map(task => this.taskToDto(task));
      
      const response: ApiResponseDto<TaskResponseDto[]> = {
        success: true,
        data: taskDtos,
        count: taskDtos.length
      };

      res.status(200).json(response);
    } catch (error) {
      const errorResponse: ErrorResponseDto = {
        success: false,
        message: 'Error fetching tasks',
        error: error instanceof Error ? error.message : 'Unknown error'
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
          message: 'Invalid input data',
          error: validationResult.error.errors.map(err => err.message).join(', ')
        };

        res.status(400).json(errorResponse);
        return;
      }

      const createTaskDto: CreateTaskDto = validationResult.data;

      const newTask: Task = {
        id: this.nextId++,
        title: createTaskDto.title,
        description: createTaskDto.description,
        completed: false, 
        createdAt: new Date()
      };

      this.tasks.push(newTask);

      const response: ApiResponseDto<TaskResponseDto> = {
        success: true,
        data: this.taskToDto(newTask),
        message: 'Task created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      const errorResponse: ErrorResponseDto = {
        success: false,
        message: 'Error creating task',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(500).json(errorResponse);
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const idValidationResult = TaskIdSchema.safeParse(id);
      
      if (!idValidationResult.success) {
        const errorResponse: ErrorResponseDto = {
          success: false,
          message: 'Task ID is required and must be a valid number'
        };

        res.status(400).json(errorResponse);
        return;
      }

      const bodyValidationResult = UpdateTaskSchema.safeParse(req.body);
      
      if (!bodyValidationResult.success) {
        const errorResponse: ErrorResponseDto = {
          success: false,
          message: 'Invalid input data',
          error: bodyValidationResult.error.errors.map(err => err.message).join(', ')
        };

        res.status(400).json(errorResponse);
        return;
      }

      const updateTaskDto: UpdateTaskDto = bodyValidationResult.data;

      const taskIndex = this.tasks.findIndex(task => task.id === parseInt(id));
      
      if (taskIndex === -1) {
        const errorResponse: ErrorResponseDto = {
          success: false,
          message: 'Task not found'
        };

        res.status(404).json(errorResponse);
        return;
      }

      const existingTask = this.tasks[taskIndex];

      const updatedTask: Task = {
        ...existingTask,
        title: updateTaskDto.title !== undefined ? updateTaskDto.title : existingTask.title,
        description: updateTaskDto.description !== undefined ? updateTaskDto.description : existingTask.description,
        completed: updateTaskDto.completed !== undefined ? updateTaskDto.completed : existingTask.completed,
        updatedAt: new Date()
      };

      this.tasks[taskIndex] = updatedTask;

      const response: ApiResponseDto<TaskResponseDto> = {
        success: true,
        data: this.taskToDto(updatedTask),
        message: 'Task updated successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const errorResponse: ErrorResponseDto = {
        success: false,
        message: 'Error updating task',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(500).json(errorResponse);
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const taskIdValidation = getTaskCodec.decodeTaskId(id);
      
      if (!taskIdValidation.success) {
        const errorResponse: ErrorResponseDto = {
          success: false,
          message: 'Task ID is required and must be a valid number'
        };

        res.status(400).json(errorResponse);
        return;
      }

      const taskIndex = this.tasks.findIndex(task => task.id === parseInt(id));
      
      if (taskIndex === -1) {
        const errorResponse: ErrorResponseDto = {
          success: false,
          message: 'Task not found'
        };

        res.status(404).json(errorResponse);
        return;
      }

      const deletedTask = this.tasks[taskIndex];

      this.tasks.splice(taskIndex, 1);

      const response: ApiResponseDto<TaskResponseDto> = {
        success: true,
        data: this.taskToDto(deletedTask),
        message: `Task "${deletedTask.title}" deleted successfully`
      };

      res.status(200).json(response);
    } catch (error) {
      const errorResponse: ErrorResponseDto = {
        success: false,
        message: 'Error deleting task',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      res.status(500).json(errorResponse);
    }
  }
}