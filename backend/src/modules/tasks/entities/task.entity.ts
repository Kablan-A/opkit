import { TaskStatus } from 'generated/prisma/enums';

export class TaskEntity {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: Date;
  updated_at: Date;
  userId: string;

  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
  }
}
