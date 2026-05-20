import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PaginatedResponse } from '../../common/types';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { ITasksRepository } from './interfaces';
import { TaskStatus } from 'generated/prisma/enums';

@Injectable()
export class TasksRepository implements ITasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
    const task = await this.prisma.task.create({
      data: {
        userId,
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status ?? TaskStatus.TODO,
      },
    });

    return task;
  }

  async findAllByUserId(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<PaginatedResponse<TaskEntity>> {
    const total = await this.prisma.task.count({
      where: { userId },
    });
    const tasks = await this.prisma.task.findMany({
      where: { userId },
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' },
    });

    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findById(taskId: string): Promise<TaskEntity | null> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    return task;
  }

  async update(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        status: updateTaskDto.status,
      },
    });

    return task;
  }

  async updateStatus(taskId: string, status: TaskStatus): Promise<TaskEntity> {
    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    return task;
  }

  async delete(taskId: string): Promise<void> {
    await this.prisma.task.delete({ where: { id: taskId } });
  }
}
