import { ProductEntity } from "@/core/entity/product";
import { WishlistCreateInput, WishlistCreateOutput } from "@/core/use-cases/wishlist-create";
import { Swagger } from "@/utils/swagger";

const BASE_URL = `api/wishlists`;

export const SwaggerResponse = {
  create: {
    201: Swagger.defaultResponseJSON<WishlistCreateOutput>({
      status: 201,
      description: 'add product to wishlist.'
    })
  },
};

export const SwaggerRequest = {
  create: Swagger.defaultRequestJSON<WishlistCreateInput>({
    name: "Presentes de Natal",
    product: { name: "Refrigerador" } as ProductEntity,
  }),
};
