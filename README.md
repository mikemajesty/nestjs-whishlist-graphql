{
"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFnYWx1IiwicGFzc3dvcmQiOiJhZG1pbiIsImlhdCI6MTczNzc3MzYwOSwiZXhwIjoxNzQxMzczNjA5fQ.1ufzoykBZ16Dl3b39U9Aj_0Iu7HM\_\_Qx6-O1mYIPO3s"
}

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
