import { PaginatedResponse } from '../../../common/types';
import { UserEntity } from '../entities';

export interface IUserRepository {
  create(email: string, passwordHash: string): Promise<UserEntity>;
  findById(userId: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findAll(
    limit?: number,
    offset?: number,
  ): Promise<PaginatedResponse<UserEntity>>;
  update(
    userId: string,
    updateData: { email?: string; passwordHash?: string },
  ): Promise<UserEntity>;
  delete(userId: string): Promise<void>;
}
