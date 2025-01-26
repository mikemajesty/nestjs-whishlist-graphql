| Statements                                                                               | Branches                                                                             | Functions                                                                              | Lines                                                                          |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat) |

{
"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFnYWx1IiwicGFzc3dvcmQiOiJhZG1pbiIsImlhdCI6MTczNzc3MzYwOSwiZXhwIjoxNzQxMzczNjA5fQ.1ufzoykBZ16Dl3b39U9Aj_0Iu7HM\_\_Qx6-O1mYIPO3s"
}

TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFnYWx1IiwicGFzc3dvcmQiOiJhZG1pbiIsImlhdCI6MTczNzc3MzYwOSwiZXhwIjoxNzQxMzczNjA5fQ.1ufzoykBZ16Dl3b39U9Aj_0Iu7HM\_\_Qx6-O1mYIPO3s

http://localhost:3000/graphql

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
