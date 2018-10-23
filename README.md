# nodejs-graphql-subscription-reactjs-demo
NodeJs Graphql Subscription implementation with Mysql database and reactjs apollo client as front end

You can find step by step guide for Golang Part 1 [here](https://www.logisticinfotech.com/blog/graphql-subscription-golang-reactjs/) And React Part 2 [here](https://www.logisticinfotech.com/blog/react-apollo-client-subscription/) to understand this demo properly.

for nodejs graphql-server-express and subscriptions-transport-ws used.

for reacjs applo-client is used.

## Preview
![](https://www.logisticinfotech.com/wp-content/uploads/2018/09/golang-react-subscription.gif)

## Import Database

  Import database gqlgenreact.sql file and change connection settings in
    express/src/resolvers.js file

## Run express server
```
  cd express
  npm install
  npm start
```

## Run reactjs code
```
  cd react
  npm install
  npm start
```

Urls to check on with this

React Server: http://localhost:3000/graphiql

Graphql Playground: http://localhost:8090/graphiql


## Further help

Checkout full blog for Golang Part 1 [here](https://www.logisticinfotech.com/blog/graphql-subscription-golang-reactjs/) And React Part 2 [here](https://www.logisticinfotech.com/blog/react-apollo-client-subscription/)
