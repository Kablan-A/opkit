export class UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
