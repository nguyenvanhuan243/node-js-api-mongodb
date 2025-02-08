# Node-js-api-mongodb
node-js-api-mongodb

# Some commands
show current node version
```
nvm current
```

switch to current node version
```
nvm use
```

Install and start node server

```
yarn install
```

```
yarn start
```

Tool connect to mongo db
```
3T Studio: https://studio3t.com/
```

MongoDB Cloud
```
https://www.mongodb.com/
```

Some api
```
Get users: https://node-js-api-mongodb.onrender.com/api/health
```

```
Get users: https://node-js-api-mongodb.onrender.com/api/users
```

Create a new user curl
```
curl --location 'localhost:3000/api/users/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "huannguyendev",
    "password": "password",
    "firstName": "firstName",
    "lastName": "lastName",
    "email": "huannguyendev@gmail.com"
}'
```