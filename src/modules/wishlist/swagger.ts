import { ProductEntity } from "@/core/entity/product";
import { WishlistEntity } from "@/core/entity/wishlist";
import { WishlistCreateInput, WishlistCreateOutput } from "@/core/use-cases/wishlist-create";
import { WishlistListOutput } from "@/core/use-cases/wishlist-list";
import { WishlistProductExistsOutput } from "@/core/use-cases/wishlist-product-exists";
import { WishlistRemoveOutput } from "@/core/use-cases/wishlist-remove";
import { WishlistUpdateInput, WishlistUpdateOutput } from "@/core/use-cases/wishlist-update";
import { Swagger } from "@/utils/swagger";

const BASE_URL = `api/wishlists/products`;

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
    }),
    404: Swagger.defaultResponseWithMultiplesError({
      status: 404,
      route: `${BASE_URL}/:productName/exixts`,
      messages: {
        'wishlist not found': { description: `when user has not a wishlist`, value: [`wishlist from user: [userName] not found.`] },
        'product not found': { description: 'when product does\'t exists on wishlist', value: [`product: [productName] does't exists on wishlist.`] }
      },
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
    }),
    422: Swagger.defaultResponseError({
      status: 422,
      route: `${BASE_URL}/:id`,
      message: `product max limit is: ${WishlistEntity.MAX_PRODUCT_LIMIT}`,
      description: 'when product limit is reached.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: `${BASE_URL}`,
      message: `wishlist from user: [userName] not found.`,
      description: 'when user has not wishlist.'
    }),
    409: Swagger.defaultResponseError({
      status: 409,
      route: `${BASE_URL}`,
      message: `product: [productName] already on the list.`,
      description: 'when product already on wishlist.'
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
    }),
    404: Swagger.defaultResponseWithMultiplesError({
      status: 404,
      route: `${BASE_URL}/:productName/exixts`,
      messages: {
        'wishlist not found': { description: 'when user has not wishlist.', value: [`wishlist from user: [userName] not found.`] },
        'product not found': { description: 'when product doesn\'t exists on wishlist.', value: [`product: [productname] does't exists on wishlist.`] }
      },
      description: 'product exists.'
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
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: BASE_URL,
      message: `wishlist from user: [userName] not found.`,
      description: `when user has not a wishlist`
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
