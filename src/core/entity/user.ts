import { z } from 'zod';

import { CryptoUtils } from '@/utils/crypto';
import { BaseEntity } from '@/utils/entity';

const ID = z.string().uuid().optional();
const Name = z.string().transform((n) => n.toUpperCase());
const Password = z.string();
const CreatedAt = z.date().nullish();
const UpdatedAt = z.date().nullish();
const DeletedAt = z.date().nullish();

export const UserEntitySchema = z.object({
  id: ID,
  name: Name,
  password: Password.optional(),
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt,
});

type User = z.infer<typeof UserEntitySchema>;

export class UserEntity extends BaseEntity<UserEntity>() {
  name!: string;

  password!: string;

  constructor(entity: User) {
    super(UserEntitySchema);
    Object.assign(this, this.validate(entity));
  }

  createPassword() {
    this.password = CryptoUtils.createHash(this.password);
    return this.password;
  }
}
