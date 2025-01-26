import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { IWishlistRemoveAdapter } from '@/modules/wishlist/adapter';
import { TestUtils } from '@/utils/tests';

import { ProductEntity } from '@/core/entity/product';
import { WishlistEntity } from '@/core/entity/wishlist';
import { IWishlistRepository } from '@/core/repository/wishlist';
import { UpdatedModel } from '@/infra/repository';
import { ApiNotFoundException } from '@/utils/exceptions/http';
import { WishlistRemoveInput, WishlistRemoveUsecase } from '../wishlist-remove';

describe(WishlistRemoveUsecase.name, () => {
  let usecase: IWishlistRemoveAdapter;
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
          provide: IWishlistRemoveAdapter,
          useFactory: (repository: IWishlistRepository) => {
            return new WishlistRemoveUsecase(repository);
          },
          inject: [IWishlistRepository],
        },
      ],
    }).compile();

    usecase = app.get(IWishlistRemoveAdapter);
    repository = app.get(IWishlistRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as WishlistRemoveInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Required',
            path: TestUtils.nameOf<WishlistRemoveInput>('productName'),
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
        productName: 'Teste',
      } as WishlistRemoveInput),
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
    repository.findOne = TestUtils.mockResolvedValue<WishlistEntity>(output);
    await expect(
      usecase.execute({
        user: TestUtils.getMockUser(),
        productName: 'Teste',
      } as WishlistRemoveInput),
    ).rejects.toThrow(
      new ApiNotFoundException(`product: TESTE does't exists on wishlist.`),
    );
  });

  test(`when remove product successfully`, async () => {
    const output = new WishlistEntity({
      id: TestUtils.getMockUUID(),
      name: 'Natal',
      products: [new ProductEntity({ name: 'Teste' })],
    });
    repository.findOne = TestUtils.mockResolvedValue<WishlistEntity>(output);
    const outputAferterRemove = { ...output, products: [] };
    repository.findOneWithExcludeFields =
      TestUtils.mockResolvedValue<WishlistEntity>(outputAferterRemove);
    repository.updateOne = TestUtils.mockResolvedValue<UpdatedModel>();
    await expect(
      usecase.execute({
        user: TestUtils.getMockUser(),
        productName: 'Teste',
      } as WishlistRemoveInput),
    ).resolves.toEqual(outputAferterRemove);
  });
});
