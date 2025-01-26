import { z } from 'zod';

import { BaseEntity } from '@/utils/entity';

const ID = z.string().uuid().optional();
const Name = z
  .string()
  .min(1)
  .trim()
  .transform((n) => n.toUpperCase());
const Description = z.string().optional();
const Price = z.number().optional();
const Stock = z.number().optional();
const Partner = z.string().optional();
const CreatedAt = z.date().nullish();
const UpdatedAt = z.date().nullish();
const DeletedAt = z.date().nullish();

export const ProductEntitySchema = z.object({
  id: ID,
  name: Name,
  description: Description,
  price: Price,
  stock: Stock,
  partner: Partner,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt,
});

type Product = z.infer<typeof ProductEntitySchema>;

export class ProductEntity extends BaseEntity<ProductEntity>() {
  name!: string;

  description?: string;

  price?: number;

  stock?: number;

  partner?: string;

  constructor(entity: Product) {
    super(ProductEntitySchema);
    Object.assign(this, this.validate(entity), this.addMock());
  }

  /**
   * @description essa função foi adicionada para adicionar mocks e facilitar a criação do produto
   */
  addMock() {
    this.description = 'descrição';
    this.partner = 'magalu';
    this.price = 18.9;
    this.stock = 12;
  }
}
