import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { TaskStatus } from 'generated/prisma/enums';
import { Server } from 'socket.io';

@WebSocketGateway()
export class TasksGateway {
  @WebSocketServer()
  server: Server;

  emitStatusChanged(
    taskId: string,
    status: TaskStatus,
    timestamp: string,
  ): void {
    this.server?.emit('task.statusChanged', {
      id: taskId,
      status,
      timestamp,
    });
  }
}
