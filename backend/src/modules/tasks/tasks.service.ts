import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { TasksRepository } from './tasks.repository';
import { TasksGateway } from './gateways/tasks.gateway';
import { TaskStatus } from 'generated/prisma/enums';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly tasksGateway: TasksGateway,
  ) {}

  create(userId: string, createTaskDto: CreateTaskDto) {
    return this.tasksRepository.create(userId, createTaskDto);
  }

  findAllByUserId(userId: string, limit?: number, offset?: number) {
    return this.tasksRepository.findAllByUserId(userId, limit, offset);
  }

  async findOneForUser(userId: string, taskId: string): Promise<TaskEntity> {
    const task = await this.tasksRepository.findById(taskId);

    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(userId: string, taskId: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOneForUser(userId, taskId);
    const updatedTask = await this.tasksRepository.update(
      task.id,
      updateTaskDto,
    );

    if (updateTaskDto.status && updateTaskDto.status !== task.status) {
      this.tasksGateway.emitStatusChanged(
        updatedTask.id,
        updatedTask.status,
        updatedTask.updated_at.toISOString(),
      );
    }

    return updatedTask;
  }

  async updateStatus(userId: string, taskId: string, status: TaskStatus) {
    const task = await this.findOneForUser(userId, taskId);
    const updatedTask = await this.tasksRepository.updateStatus(
      task.id,
      status,
    );

    if (updatedTask.status !== task.status) {
      this.tasksGateway.emitStatusChanged(
        updatedTask.id,
        updatedTask.status,
        updatedTask.updated_at.toISOString(),
      );
    }

    return updatedTask;
  }

  async remove(userId: string, taskId: string) {
    await this.findOneForUser(userId, taskId);
    await this.tasksRepository.delete(taskId);
  }
}
