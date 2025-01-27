# Nestjs Wishlist com Graphql

### Pré requisitos
 * Docker
 * Docker compose

### Building and Running the application
    yarn infra

---

| Statements                                                                               | Branches                                                                             | Functions                                                                              | Lines                                                                          |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat) |

### Test

- run
  ```
  $ yarn test
  ```
- coverage
  ```
  $ yarn test:cov
  ```

---

#### Nesse projeto foi desenvolvido uma Wishlist com Graphql e Nestjs

---- Notas de arquitetura ----

A arquitetura foi desenvolvida com base nos princípios do Clean Architecture, embora apresente pequenas diferenças em alguns pontos. Essas diferenças foram intencionais, visando aproveitar o poder de modularização oferecido pelo NestJS. Mais adiante, discutirei detalhadamente cada camada.


---

--- Notas da documentação ---

 #### Eu desenvolvi todos os endpoints requeridos em **HTTP**
 - http://localhost:3000/docs#/
 - para acessar sera disponibilizado dois tokens para teste, o mesmo deve ficar no Header no padão Bearer Authentication, ou no [Authorize] do Swagger
 - **user Magalu:**
    ```
        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFnYWx1IiwicGFzc3dvcmQiOiIqKioqIiwiaWF0IjoxNzM3OTE4NjQ5LCJleHAiOjE3NDE1MTg2NDl9.J4SrZse5ziTWgZ84HMWvs_d0X7L0Pf3-hFAPEMriLWE
    ```
 - **user Joãozinho:**
    ```
        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm_Do296aW5obyIsInBhc3N3b3JkIjoiKioqKiIsImlhdCI6MTczNzkxODY0OSwiZXhwIjoxNzQxNTE4NjQ5fQ.VfnUWdNmSMYjriEWPgCunkB6hqWJVwmXzzShNUW6kCM
    ```
---

#### Foi desenvolvido os dois endpoints de consulta em Graphql: 

 - http://localhost:3000/graphql
 - para acessar sera disponibilizado dois tokens para teste
 - **user Magalu:** 
    ```
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFnYWx1IiwicGFzc3dvcmQiOiIqKioqIiwiaWF0IjoxNzM3OTE4NjQ5LCJleHAiOjE3NDE1MTg2NDl9.J4SrZse5ziTWgZ84HMWvs_d0X7L0Pf3-hFAPEMriLWE"
    }
    ```
  - **user Joãozinho:**
    ```
    {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm_Do296aW5obyIsInBhc3N3b3JkIjoiKioqKiIsImlhdCI6MTczNzkxODY0OSwiZXhwIjoxNzQxNTE4NjQ5fQ.VfnUWdNmSMYjriEWPgCunkB6hqWJVwmXzzShNUW6kCM"
    }
    ```
 - Consultar se um determinado produto está na Wishlist do cliente
    ```
    {
      productExists(name: "name here") {
        name
        description
        price
        stock
        partner
      }
    }
    ```
- Consultar todos os produtos da Wishlist do cliente
  ```
  {
    productList {
      name
      products {
        name
        description
        price
        stock
        partner
      }
    }
  }
  ```

### Informações importantes

Durante o desenvolvimento, tomei decisões intencionais para facilitar os testes que vocês realizarão. Embora algumas dessas decisões possam parecer práticas inadequadas, elas foram feitas de forma consciente. Listarei essas escolhas a seguir.

#### Collection (Mongo)
 - Eu optei por não salvar o user e o produtos em collections diferentes para facilitar o desenvolvimento.

#### Autenticação
 - Não segui as melhores práticas em relação a criação e regras de expiração do **Token**. Ele foi criado exclusivamente para associar a wishlist ao cliente, e essa associação foi feita com base no nome, embora saiba que essa abordagem não é uma abordagem correta. Essa decisão foi tomada para simplificar o desenvolvimento. Além disso, não me preocupei em implementar um sistema de login.

#### Caso de uso [Adicionar um produto na Wishlist do cliente]
* Sempre que um produto é adicionado à wishlist, incluo alguns campos fixos no produto. Essa abordagem foi adotada para melhorar a exibição e facilitar os testes com **GraphQL**.
* É criado uma senha para o user que não é usada no sistema, foi mantido afim de exemplo.
#### Caso de uso [Remover um produto da Wishlist do cliente]
* Eu estou usando o nome do produto afim de facilitar os testes
#### Cado de uso [Consultar todos os produtos da Wishlist do cliente]
* Eu estou usando o nome do produto afim de facilitar os testes
---

## Arquitetura
  * **core**: A camada reponsavel pelas orquestração e aplicação das regras de negócio 
    * **core => entity**: Camada responsavel por executar regras de negocio associada com aos seus respectivos campos.
    * **core => repository**: Camada responsavel por abstrair a implementação do repositorio
    * **core => use-cases**: Camada responsavel por orquestrar as regras de negocio e as regras da aplicação.
  ---
  * **modules**: Aqui tem uma pequena diferença com a arquitetura Clean Architeture, pois eu gosto de aproveitar o poder que o Nestjs tem de modularização, vou listar abaixo alguns detalhes
    * **modules => adapters**: Adaptadores responsaveis por abstrair a implementação dos use cases, afim de se comunicar com o controller
    * **modules => controler**: Controlador HTTP padrão
    * **modules => module**: Modulador do Nestjs
    * **modules => repository**: Implementação do repositorio
    * **modules => resolver**: Controlador Graphql
    * **modules => swagger**: Documentação do Swagger
---
-- Skeleton

```
.
├── docker-compose.yml
├── Dockerfile
├── jest.config.ts
├── nest-cli.json
├── package.json
├── README.md
├── schema.gql
├── src
│   ├── core
│   │   ├── entity
│   │   │   ├── product.ts
│   │   │   ├── user.ts
│   │   │   └── wishlist.ts
│   │   ├── repository
│   │   │   └── wishlist.ts
│   │   └── use-cases
│   │       ├── __tests__
│   │       │   ├── wishlist-create.spec.ts
│   │       │   ├── wishlist-list.spec.ts
│   │       │   ├── wishlist-product-exists.spec.ts
│   │       │   ├── wishlist-remove.spec.ts
│   │       │   └── wishlist-update.spec.ts
│   │       ├── wishlist-create.ts
│   │       ├── wishlist-list.ts
│   │       ├── wishlist-product-exists.ts
│   │       ├── wishlist-remove.ts
│   │       └── wishlist-update.ts
│   ├── infra
│   │   ├── database
│   │   │   ├── adapter.ts
│   │   │   ├── enum.ts
│   │   │   ├── index.ts
│   │   │   ├── mongo
│   │   │   │   ├── config.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── migrations
│   │   │   │   ├── module.ts
│   │   │   │   ├── schemas
│   │   │   │   │   ├── product.ts
│   │   │   │   │   ├── user.ts
│   │   │   │   │   └── wishlist.ts
│   │   │   │   └── service.ts
│   │   │   └── types.ts
│   │   ├── graphql
│   │   │   └── module.ts
│   │   ├── logger
│   │   │   ├── adapter.ts
│   │   │   ├── index.ts
│   │   │   ├── module.ts
│   │   │   ├── service.ts
│   │   │   └── types.ts
│   │   ├── module.ts
│   │   ├── repository
│   │   │   ├── adapter.ts
│   │   │   ├── index.ts
│   │   │   ├── mongo
│   │   │   │   └── repository.ts
│   │   │   ├── types.ts
│   │   │   └── util.ts
│   │   └── secrets
│   │       ├── adapter.ts
│   │       ├── index.ts
│   │       ├── module.ts
│   │       ├── service.ts
│   │       └── types.ts
│   ├── libs
│   │   ├── module.ts
│   │   └── token
│   │       ├── adapter.ts
│   │       ├── index.ts
│   │       ├── module.ts
│   │       └── service.ts
│   ├── main.ts
│   ├── middlewares
│   │   ├── filters
│   │   │   ├── exception-handler.filter.ts
│   │   │   └── index.ts
│   │   ├── interceptors
│   │   │   ├── exception-handler.interceptor.ts
│   │   │   ├── http-logger.interceptor.ts
│   │   │   └── index.ts
│   │   └── middlewares
│   │       ├── authentication.middleware.ts
│   │       ├── graphql.middleware.ts
│   │       └── index.ts
│   ├── modules
│   │   ├── health
│   │   │   ├── controller.ts
│   │   │   └── module.ts
│   │   └── wishlist
│   │       ├── adapter.ts
│   │       ├── controller.ts
│   │       ├── module.ts
│   │       ├── repository.ts
│   │       ├── resolver.ts
│   │       └── swagger.ts
│   ├── module.ts
│   └── utils
│       ├── collection.ts
│       ├── crypto.ts
│       ├── date.ts
│       ├── decorators
│       │   ├── index.ts
│       │   ├── mongo
│       │   │   ├── convert-mongoose-filter.decorator.ts
│       │   │   └── validate-mongoose-filter.decorator.ts
│       │   ├── types.ts
│       │   ├── utils.ts
│       │   ├── validate-database-sort-allowed.decorator.ts
│       │   └── validate-schema.decorator.ts
│       ├── entity.ts
│       ├── exceptions
│       │   ├── graphql.ts
│       │   └── http.ts
│       ├── http-status.ts
│       ├── mongoose.ts
│       ├── pagination.ts
│       ├── search.ts
│       ├── sort.ts
│       ├── swagger.ts
│       ├── tests.ts
│       ├── types.ts
│       ├── usecase.ts
│       └── uuid.ts
├── tsconfig.build.json
└── tsconfig.json
```

## License

It is available under the MIT license.
[License](https://opensource.org/licenses/mit-license.php)
