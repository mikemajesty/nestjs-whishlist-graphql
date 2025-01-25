import { WishlistCreateInput, WishlistCreateOutput } from "@/core/use-cases/wishlist-create";
import { WishlistUpdateInput, WishlistUpdateOutput } from "@/core/use-cases/wishlist-update";
import { IUsecase } from "@/utils/usecase";

export abstract class IWishlistCreateAdapter implements IUsecase {
  abstract execute(input: WishlistCreateInput): Promise<WishlistCreateOutput>;
}

export abstract class IWishlistUpdateAdapter implements IUsecase {
  abstract execute(input: WishlistUpdateInput): Promise<WishlistUpdateOutput>;
}