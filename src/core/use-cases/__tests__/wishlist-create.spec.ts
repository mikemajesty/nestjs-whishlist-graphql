import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { IWishlistCreateAdapter } from '@/modules/wishlist/adapter';
import { TestUtils } from '@/utils/tests';

import { ProductEntity } from '@/core/entity/product';
import { WishlistEntity } from '@/core/entity/wishlist';
import { IWishlistRepository } from '@/core/repository/wishlist';
import { CreatedModel } from '@/infra/repository';
import { WishlistCreateInput, WishlistCreateUsecase } from '../wishlist-create';

describe(WishlistCreateUsecase.name, () => {
  let usecase: IWishlistCreateAdapter;
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
          provide: IWishlistCreateAdapter,
          useFactory: (repository: IWishlistRepository) => {
            return new WishlistCreateUsecase(repository);
          },
          inject: [IWishlistRepository],
        },
      ],
    }).compile();

    usecase = app.get(IWishlistCreateAdapter);
    repository = app.get(IWishlistRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as WishlistCreateInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([
          {
            message: 'Required',
            path: TestUtils.nameOf<WishlistCreateInput>('name'),
          },
          {
            message: 'Required',
            path: TestUtils.nameOf<WishlistCreateInput>('product'),
          },
        ]);
      },
    );
  });

  test('when wishlist is created successfully ', async () => {
    repository.create = TestUtils.mockResolvedValue<CreatedModel>();
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
        name: output.name,
        product: { name: 'Arvore' },
      } as WishlistCreateInput),
    ).resolves.toEqual(output);
  });
});
