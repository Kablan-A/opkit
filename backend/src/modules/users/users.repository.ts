import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from '../../common/types';
import { UserEntity } from './entities';
import { IUserRepository } from './interfaces';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string, passwordHash: string): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: { email, passwordHash },
    });
    return user;
  }

  async findById(userId: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findAll(
    limit: number = 10,
    offset: number = 0,
  ): Promise<PaginatedResponse<UserEntity>> {
    const total = await this.prisma.user.count();
    const users = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
    });

    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
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

  async update(
    userId: string,
    updateData: { email?: string; passwordHash?: string },
  ): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    return user;
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.user.delete({ where: { id: userId } });
  }
}
