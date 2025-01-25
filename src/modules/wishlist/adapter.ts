import { WishlistCreateInput, WishlistCreateOutput } from "@/core/use-cases/wishlist-create";
import { WishlistListInput, WishlistListOutput } from "@/core/use-cases/wishlist-list";
import { WishlistProductExistsInput, WishlistProductExistsOutput } from "@/core/use-cases/wishlist-product-exists";
import { WishlistRemoveInput, WishlistRemoveOutput } from "@/core/use-cases/wishlist-remove";
import { WishlistUpdateInput, WishlistUpdateOutput } from "@/core/use-cases/wishlist-update";
import { IUsecase } from "@/utils/usecase";

export abstract class IWishlistCreateAdapter implements IUsecase {
  abstract execute(input: WishlistCreateInput): Promise<WishlistCreateOutput>;
}

export abstract class IWishlistUpdateAdapter implements IUsecase {
  abstract execute(input: WishlistUpdateInput): Promise<WishlistUpdateOutput>;
}

export abstract class IWishlistRemoveAdapter implements IUsecase {
  abstract execute(input: WishlistRemoveInput): Promise<WishlistRemoveOutput>;
}

export abstract class IWishlistListAdapter implements IUsecase {
  abstract execute(input: WishlistListInput): Promise<WishlistListOutput>;
}

export abstract class IWishlistProductExistsAdapter implements IUsecase {
  abstract execute(input: WishlistProductExistsInput): Promise<WishlistProductExistsOutput>;
}