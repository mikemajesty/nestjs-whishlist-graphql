| Statements                                                                               | Branches                                                                             | Functions                                                                              | Lines                                                                          |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat) |

{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFnYWx1IiwicGFzc3dvcmQiOiIqKioqIiwiaWF0IjoxNzM3OTE4NjQ5LCJleHAiOjE3NDE1MTg2NDl9.J4SrZse5ziTWgZ84HMWvs_d0X7L0Pf3-hFAPEMriLWE"
}

TOKEN_USER_MAGALU=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFnYWx1IiwicGFzc3dvcmQiOiIqKioqIiwiaWF0IjoxNzM3OTE4NjQ5LCJleHAiOjE3NDE1MTg2NDl9.J4SrZse5ziTWgZ84HMWvs_d0X7L0Pf3-hFAPEMriLWE

TOKEN_USER_JOAO=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm_Do296aW5obyIsInBhc3N3b3JkIjoiKioqKiIsImlhdCI6MTczNzkxODY0OSwiZXhwIjoxNzQxNTE4NjQ5fQ.VfnUWdNmSMYjriEWPgCunkB6hqWJVwmXzzShNUW6kCM

http://localhost:3000/graphql

http://localhost:3000/docs#/

{
  productExists(name: "name here") {
    name
    description
    price
    stock
    partner
  }
}

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
