import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { IWishlistProductExistsAdapter } from '@/modules/wishlist/adapter';
import { TestUtils } from '@/utils/tests';

import { ProductEntity } from '@/core/entity/product';
import { WishlistEntity } from '@/core/entity/wishlist';
import { IWishlistRepository } from '@/core/repository/wishlist';
import { ApiNotFoundException } from '@/utils/exceptions/http';
import {
  WishlistProductExistsInput,
  WishlistProductExistsUsecase,
} from '../wishlist-product-exists';

describe(WishlistProductExistsUsecase.name, () => {
  let usecase: IWishlistProductExistsAdapter;
  let repository: IWishlistRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: IWishlistRepository,
          useValue: {},
        },
        {
          provide: IWishlistProductExistsAdapter,
          useFactory: (repository: IWishlistRepository) => {
            return new WishlistProductExistsUsecase(repository);
          },
          inject: [IWishlistRepository],
        },
      ],
    }).compile();

    usecase = app.get(IWishlistProductExistsAdapter);
    repository = app.get(IWishlistRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as WishlistProductExistsInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Required',
            path: TestUtils.nameOf<WishlistProductExistsInput>('productName'),
          },
        ]);
      },
    );
  });

  test(`when wishlist not found, should expect an ApiNotFoundException`, async () => {
    repository.findOneWithExcludeFields =
      TestUtils.mockResolvedValue<WishlistEntity>(null);
    await expect(
      usecase.execute({
        user: TestUtils.getMockUser(),
        productName: 'Teste',
      } as WishlistProductExistsInput),
    ).rejects.toThrow(
      new ApiNotFoundException('wishlist from user: TEST not found.'),
    );
  });

  test(`when product does't exists on wishlist, should expect an ApiNotFoundException`, async () => {
    const output = new WishlistEntity({
      id: TestUtils.getMockUUID(),
      name: 'Natal',
      products: [new ProductEntity({ name: 'Arvore' })],
    });
    repository.findOneWithExcludeFields =
      TestUtils.mockResolvedValue<WishlistEntity>(output);
    await expect(
      usecase.execute({
        user: TestUtils.getMockUser(),
        productName: 'Teste',
      } as WishlistProductExistsInput),
    ).rejects.toThrow(
      new ApiNotFoundException(`product: TESTE does't exists on wishlist.`),
    );
  });

  test(`when product exists, should expect a product`, async () => {
    const product = new ProductEntity({ name: 'Teste' });
    const output = new WishlistEntity({
      id: TestUtils.getMockUUID(),
      name: 'Natal',
      products: [product],
    });
    repository.findOneWithExcludeFields =
      TestUtils.mockResolvedValue<WishlistEntity>(output);
    await expect(
      usecase.execute({
        user: TestUtils.getMockUser(),
        productName: 'Teste',
      } as WishlistProductExistsInput),
    ).resolves.toEqual(product);
  });
});
