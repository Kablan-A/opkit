import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { UserEntity } from '../entities';

export class ResponseUserDto {
  @IsEmail()
  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
