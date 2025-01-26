import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { IWishlistUpdateAdapter } from '@/modules/wishlist/adapter';
import { TestUtils } from '@/utils/tests';

import { ProductEntity } from '@/core/entity/product';
import { WishlistEntity } from '@/core/entity/wishlist';
import { IWishlistRepository } from '@/core/repository/wishlist';
import { UpdatedModel } from '@/infra/repository';
import {
  ApiConflictException,
  ApiNotFoundException,
  ApiUnprocessableEntityException,
} from '@/utils/exceptions/http';
import { WishlistUpdateInput, WishlistUpdateUsecase } from '../wishlist-update';

describe(WishlistUpdateUsecase.name, () => {
  let usecase: IWishlistUpdateAdapter;
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
          provide: IWishlistUpdateAdapter,
          useFactory: (repository: IWishlistRepository) => {
            return new WishlistUpdateUsecase(repository);
          },
          inject: [IWishlistRepository],
        },
      ],
    }).compile();

    usecase = app.get(IWishlistUpdateAdapter);
    repository = app.get(IWishlistRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as WishlistUpdateInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Required',
            path: TestUtils.nameOf<WishlistUpdateInput>('name'),
          },
        ]);
      },
    );
  });

  test(`when wishlist not found, should expect an ApiNotFoundException`, async () => {
    repository.findOne = TestUtils.mockResolvedValue<WishlistEntity>(null);
    await expect(
      usecase.execute({
        user: TestUtils.getMockUser(),
        name: 'Test',
      } as WishlistUpdateInput),
    ).rejects.toThrow(
      new ApiNotFoundException('wishlist from user: TEST not found.'),
    );
  });

  test(`when product already exists on wishlist, should expect an ApiConflictException`, async () => {
    const output = new WishlistEntity({
      id: TestUtils.getMockUUID(),
      name: 'Natal',
      products: [new ProductEntity({ name: 'Test' })],
    });
    repository.findOne = TestUtils.mockResolvedValue<WishlistEntity>(output);
    await expect(
      usecase.execute({
        user: TestUtils.getMockUser(),
        name: 'Test',
      } as WishlistUpdateInput),
    ).rejects.toThrow(
      new ApiConflictException(`product: TEST already on the list.`),
    );
  });

  test(`when max product limit was reached, should expect an ApiUnprocessableEntityException`, async () => {
    const products = [];
    for (let index = 0; index < 20; index++) {
      products.push(new ProductEntity({ name: `Test: ${index}` }));
    }
    const output = new WishlistEntity({
      id: TestUtils.getMockUUID(),
      name: 'Natal',
      products,
    });
    repository.findOne = TestUtils.mockResolvedValue<WishlistEntity>(output);
    await expect(
      usecase.execute({
        user: TestUtils.getMockUser(),
        name: 'Test',
      } as WishlistUpdateInput),
    ).rejects.toThrow(
      new ApiUnprocessableEntityException(
        `product max limit is: ${WishlistEntity.MAX_PRODUCT_LIMIT}`,
      ),
    );
  });

  test(`when update product successfully`, async () => {
    const output = new WishlistEntity({
      id: TestUtils.getMockUUID(),
      name: 'Natal',
      products: [new ProductEntity({ name: 'Arvore' })],
    });
    repository.findOne = TestUtils.mockResolvedValue<WishlistEntity>(output);

    const outputUpdate = new WishlistEntity({
      ...output,
      products: output.products.concat(new ProductEntity({ name: 'Teste' })),
    });
    repository.findOneWithExcludeFields =
      TestUtils.mockResolvedValue<WishlistEntity>(outputUpdate);
    repository.updateOne = TestUtils.mockResolvedValue<UpdatedModel>();

    await expect(
      usecase.execute({
        user: TestUtils.getMockUser(),
        name: 'Teste',
      } as WishlistUpdateInput),
    ).resolves.toEqual(outputUpdate);
  });
});
