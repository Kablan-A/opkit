import { PaginatedResponse } from '../../../common/types';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { TaskStatus } from 'generated/prisma/enums';

export interface ITasksRepository {
  create(userId: string, createTaskDto: CreateTaskDto): Promise<TaskEntity>;
  findAllByUserId(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<PaginatedResponse<TaskEntity>>;
  findById(taskId: string): Promise<TaskEntity | null>;
  update(taskId: string, updateTaskDto: UpdateTaskDto): Promise<TaskEntity>;
  updateStatus(taskId: string, status: TaskStatus): Promise<TaskEntity>;
  delete(taskId: string): Promise<void>;
}
