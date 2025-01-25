import { ProductEntity } from "@/core/entity/product";
import { WishlistCreateInput, WishlistCreateOutput } from "@/core/use-cases/wishlist-create";
import { WishlistListOutput } from "@/core/use-cases/wishlist-list";
import { WishlistProductExistsOutput } from "@/core/use-cases/wishlist-product-exists";
import { WishlistRemoveOutput } from "@/core/use-cases/wishlist-remove";
import { WishlistUpdateInput, WishlistUpdateOutput } from "@/core/use-cases/wishlist-update";
import { Swagger } from "@/utils/swagger";

const BASE_URL = `api/wishlists`;

export const SwaggerResponse = {
  exists: {
    200: Swagger.defaultResponseJSON<WishlistProductExistsOutput>({
      status: 200,
      json: {
        "id": "db1875ec-e93f-4bdb-af9a-58934a24394c",
        "name": "LAVADORA",
        "description": "descrição",
        "price": 18.9,
        "stock": 12,
        "partner": "magalu"
      } as WishlistProductExistsOutput,
      description: 'product exists.'
    })
  },
  create: {
    201: Swagger.defaultResponseJSON<WishlistCreateOutput>({
      status: 201,
      json: {
        products: [
          {
            "id": "db1875ec-e93f-4bdb-af9a-58934a24394c",
            "name": "LAVADORA",
            "description": "descrição",
            "price": 18.9,
            "stock": 12,
            "partner": "magalu"
          }
        ] as ProductEntity[],
        id: "3bac5c73-4a13-4ac3-8263-d501c669d9f6",
        name: "Presentes de Natal",
        deletedAt: null
      } as WishlistCreateOutput,
      description: 'add product to wishlist.'
    })
  },
  update: {
    200: Swagger.defaultResponseJSON<WishlistUpdateOutput>({
      status: 200,
      json: {
        products: [
          {
            "id": "db1875ec-e93f-4bdb-af9a-58934a24394c",
            "name": "LAVADORA",
            "description": "descrição",
            "price": 18.9,
            "stock": 12,
            "partner": "magalu"
          }
        ] as ProductEntity[],
        id: "3bac5c73-4a13-4ac3-8263-d501c669d9f6",
        name: "Presentes de Natal",
        deletedAt: null
      } as WishlistCreateOutput,
      description: 'add product from exist wishlist.'
    })
  },
  delete: {
    200: Swagger.defaultResponseJSON<WishlistRemoveOutput>({
      status: 200,
      json: {
        products: [
          {
            "id": "db1875ec-e93f-4bdb-af9a-58934a24394c",
            "name": "LAVADORA",
            "description": "descrição",
            "price": 18.9,
            "stock": 12,
            "partner": "magalu"
          }
        ] as ProductEntity[],
        id: "3bac5c73-4a13-4ac3-8263-d501c669d9f6",
        name: "Presentes de Natal",
        deletedAt: null
      } as WishlistCreateOutput,
      description: 'remove product from exist wishlist.'
    })
  },
  list: {
    200: Swagger.defaultResponseJSON<WishlistListOutput>({
      status: 200,
      json: {
        products: [
          {
            "id": "db1875ec-e93f-4bdb-af9a-58934a24394c",
            "name": "LAVADORA",
            "description": "descrição",
            "price": 18.9,
            "stock": 12,
            "partner": "magalu"
          }
        ] as ProductEntity[],
        id: "3bac5c73-4a13-4ac3-8263-d501c669d9f6",
        name: "Presentes de Natal",
        deletedAt: null
      } as WishlistListOutput,
      description: 'list all products from wishlist.'
    })
  },
};

export const SwaggerRequest = {
  create: Swagger.defaultRequestJSON<WishlistCreateInput>({
    name: "Presentes de Natal",
    product: { name: "Refrigerador" } as ProductEntity,
  }),
  update: Swagger.defaultRequestJSON<WishlistUpdateInput>({
    name: "Refrigerador"
  })
};
