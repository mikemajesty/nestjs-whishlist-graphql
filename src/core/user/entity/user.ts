import { z } from 'zod';

import { CryptoUtils } from '@/utils/crypto';
import { BaseEntity } from '@/utils/entity';
import { ApiBadRequestException } from '@/utils/exception';


const ID = z.string().uuid();
const Email = z.string().email();
const Name = z.string();
const Password = z.string();
const CreatedAt = z.date().nullish();
const UpdatedAt = z.date().nullish();
const DeletedAt = z.date().nullish();

export const UserEntitySchema = z.object({
  id: ID,
  name: Name,
  email: Email,
  password: Password,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt
});

type User = z.infer<typeof UserEntitySchema>;

export class UserEntity extends BaseEntity<UserEntity>() {
  name!: string;

  email!: string;

  password!: string;

  constructor(entity: User) {
    super(UserEntitySchema);
    Object.assign(this, this.validate(entity));
  }

  createPassword() {
    this.password = CryptoUtils.createHash(this.password);
    return this.password;
  }

  verifyPassword(password: string) {
    if (this.password !== password) {
      throw new ApiBadRequestException('incorrectPassword');
    }
  }
}
