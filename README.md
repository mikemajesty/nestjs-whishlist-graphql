# Nestjs Wishlist com Graphql

### Pré requisitos
 * Docker
 * Docker compose

### Building and Running the application
    yarn infra
  

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



| Statements                                                                               | Branches                                                                             | Functions                                                                              | Lines                                                                          |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat) |

---

#### Nesse projeto foi desenvolvido uma Wishlist com Graphql e Nestjs

---- Notas de arquitetura ----

A arquitetura foi desenvolvida com base nos princípios do Clean Architecture, embora apresente pequenas diferenças em alguns pontos. Essas diferenças foram intencionais, visando aproveitar o poder de modularização oferecido pelo NestJS. Mais adiante, discutirei detalhadamente cada camada.


---

--- Notas da documentação ---

 Eu desenvolvi todos os endpoints requeridos em **HTTP**, documentação em
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

#### Foi desenvolvido os dois endpoints de consulta em Graphql, documentação em: 
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
 - Não segui as melhores práticas em relação a criação e regras da expiração do **Token**. Ele foi criado exclusivamente para associar a wishlist ao cliente, e essa associação foi feita com base no nome, embora saiba que essa abordagem não é uma abordagem correta. Essa decisão foi tomada para simplificar o desenvolvimento. Além disso, não me preocupei em implementar um sistema de login.

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
    * **core => use-cases**: Camada responsavel por orquestrar as regras de negocio e as regas da aplicação.
  ---
  * **modules**: Aqui tem uma pequena diferença com a arquitetura Clean Architeture, pois eu gosto de aproveitar o poder que o Nestjs tem, vou listar abaixo alguns detalhes
    * **modules => adapters**: Adaptadores responsaveis por abstrair a implementação afim de se comunicar com o use-cases
    * **modules => controler**: Controlador HTTP padrão
    * **modules => module**: Modulador do Nestjs
    * **modules => repository**: Implementação do repositorio
    * **modules => resolver**: Controlador Graphql
    * **modules => swagger**: Documentação do Swagger