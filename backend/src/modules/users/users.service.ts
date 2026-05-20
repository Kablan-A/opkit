import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { hashPassword } from '../../common/utils/hash.util';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await hashPassword(createUserDto.password);
    return this.usersRepository.create(createUserDto.email, passwordHash);
  }

  findAll(limit?: number, offset?: number) {
    return this.usersRepository.findAll(limit, offset);
  }

  findOne(id: string) {
    return this.usersRepository.findById(id);
  }

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const passwordHash = updateUserDto.password
      ? await hashPassword(updateUserDto.password)
      : undefined;

    return this.usersRepository.update(id, {
      email: updateUserDto.email,
      passwordHash,
    });
  }

  delete(id: string) {
    return this.usersRepository.delete(id);
  }
}
