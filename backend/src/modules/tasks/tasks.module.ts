import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TasksController } from './tasks.controller';
import { TasksGateway } from './gateways/tasks.gateway';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [PrismaService, TasksRepository, TasksService, TasksGateway],
})
export class TasksModule {}
