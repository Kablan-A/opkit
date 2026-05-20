import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from 'generated/prisma/enums';

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;
}
