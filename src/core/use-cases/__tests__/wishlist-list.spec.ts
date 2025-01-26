import { Test } from '@nestjs/testing';

import { IWishlistListAdapter } from '@/modules/wishlist/adapter';

import { ProductEntity } from '@/core/entity/product';
import { WishlistEntity } from '@/core/entity/wishlist';
import { IWishlistRepository } from '@/core/repository/wishlist';
import { ApiNotFoundException } from '@/utils/exceptions/http';
import { TestUtils } from '@/utils/tests';
import { WishlistListInput, WishlistListUsecase } from '../wishlist-list';

describe(WishlistListUsecase.name, () => {
  let usecase: IWishlistListAdapter;
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
          provide: IWishlistListAdapter,
          useFactory: (repository: IWishlistRepository) => {
            return new WishlistListUsecase(repository);
          },
          inject: [IWishlistRepository],
        },
      ],
    }).compile();

    usecase = app.get(IWishlistListAdapter);
    repository = app.get(IWishlistRepository);
  });

  test(`when wishlist not found, should expect an ApiNotFoundException`, async () => {
    repository.findOneWithExcludeFields =
      TestUtils.mockResolvedValue<WishlistEntity>(null);
    await expect(
      usecase.execute({ user: TestUtils.getMockUser() } as WishlistListInput),
    ).rejects.toThrow(
      new ApiNotFoundException('wishlist from user: TEST not found.'),
    );
  });

  test(`when wishlist successfully`, async () => {
    const output = new WishlistEntity({
      id: TestUtils.getMockUUID(),
      name: 'Natal',
      products: [new ProductEntity({ name: 'Arvore' })],
    });
    repository.findOneWithExcludeFields =
      TestUtils.mockResolvedValue<WishlistEntity>(output);
    await expect(
      usecase.execute({ user: TestUtils.getMockUser() } as WishlistListInput),
    ).resolves.toEqual(output);
  });
});
