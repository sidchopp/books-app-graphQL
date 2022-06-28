# About this project

It is a learning project on GraphQL, a query language for APIs. I work on this project while following a great tutorial on youtube by the "The Net Ninja" and simultaneously going through the official documentation on <a href="https://graphql.org/" target="_blank"  > GraphQL</a>.

## Server

A GraphQL server is built on Node.js using Express. Here we have defined how our graph looks, different types of data on our graph, relationship between those data types, set different entry points into the graph. To initially test the graphQL server, a tool called Graphiql that helps to structure/test GraphQL queries correctly is also used.

## Database

This GraphQL server is connected with a MongoDB instance, where our Data(Books, Authors, etc.) is actually stored. It's not necessary to use MongoDB ( a nonSQL db) here, one can use any SQL db too.

## Client

A React Client is built that talks to the GraphQL Server and gets the requested data which was stored in the MongoDB. It's not necessary to use React here, one can use Angular, Vue or any other Front-end framework.

## Full Stack over view

Client(Browser) <----> Server(Node.js) <---> DataBase(MongoDB)

## To Start the project

1. Start a command shell (CMD, PowerShell, Terminal, etc.)
1. Make a directory/folder for your work: `mkdir books-app-graphQL`
1. `cd books-app-graphQL`
1. Make a subfolder by the name of `server`
1. `cd server`
1. To use import (and not require in Node), write : `"type": "module"` in package.json. Make sure to write files with `.js` extensions while importing now.
1. Start VS Code for this project: `code .`

## For Express

1. Now install Express : `npm install express --save`
1. Inside the server folder create a file `app.js` and write the following code in it:

```js
import express from "express";
const app = express();
const port = 4000;
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});
app.listen(port, () => {
  console.log(`Server is listening on port ${port}..`);
});
```

1. Install a package called nodemon which automatically restart the node application when file changes in the directory are detected. : `npm install --save-dev nodemon`
1. In package.json file, in `scripts` add:
   `{"start": "nodemon app.js"},`
1. To start the Node server, write : `node start`

## For GraphQL

1. From `server` folder run:

```js
 npm install graphql express-graphql
```

The first package `graphql` is the main graphQL package which is a JavaScript implementation of GraphQL. The second package `express-graphql` will help our express server to understand/talk with graphQL

1. Inside `app.js`, write:
   ```js
   import { graphqlHTTP } from "express-graphql";
   ```
1. For middleware, also write:

   ```js
   app.use("/graphql", graphqlHTTP({}));
   ```

   In the above step, we have created a single endpoint `/graphql`, to which we will send all our graphQL queries. So, anyone sends a request to this endpoint, `graphqlHTTP` function will be fired. This function takes an object which we will talk about in next step. If we run our server now we get an error:

   ```js
   {"errors":[{"message":"GraphQL middleware options must contain a schema."}]}
   ```

   To avoid this error, we need to pass in a `schema` in the `app.use` middleware. That `schema` will tell our express graphql server about our data types and how they are related, their properties, etc. The basic purpose of `schema` here is to jump to different points in our graph and to retrieve or mutate our data. So, we first create a `schema` and then pass it into the `app.use` middleware so that graphql knows exactly how to deal with our data queries.

### Schema

1. Create a subfolder named `schema` in the `server` folder and inside it create a new file `schema.js`. Inside this file write:

```js
import graphql from "graphql";
const { GraphQLObjectType } = graphql;
```

Here we have imported graphql in our schema.js file and then using destructuring we defined a function `GraphQLObjectType` which takes an object as a parameter.

1. Let's define an Object type here, say BookType.

```js
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({}),
});
```

This object parameter that we will pass to the function `GraphQLObjectType` will define what this BookType is all about. Then we include key-value pairs( or properties) in this object like `name`, `fields`. This `fields` property is going to be a function. The reason that `fields` here is a function because when we have multiple types and they have references to each other, then one type will know what other type is. Now, this `fields` function will return an object and we define all our fields liek `id`, `name`, `genre` (and their type which is only understood by graphql) in this object. So, we again destructure `graphql` to further obtain those special types, like:

```js
import graphql from "graphql";
const { GraphQLString, GraphQLSchema } = graphql;
```

Now, we pass this to our `fields` property in the `BookType` as objects

```js
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
});
```

So, above we have defined our first type called `BookType` and then we gave it a `name` and defined its `fields` and also the `type` of those fields. Now, it's time to pass this `schema` into the `app.use` middleware, so that we can make queries to our data( which we have not defined yet). Such queries are called root queries. The `schema.js` file has 3 responsibilities- to define types( for ex BookType), to define relationships between types( for ex between BookType and AuthorType, which we will create later) and to define root queries( which means the entry points into a graph). Let's create a root query in this file:

```js
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from DB or any other source
      },
    },
  },
});

// To import this schema into our middleware app.use() declared in app.js file, we need to export it first

export default new GraphQLSchema({
  query: RootQuery,
});
```

Things to remember about root queries:

1.  firstly we don't have to wrap `fields` of RootQuery in a function(unlike we did in `BookType`).
1.  secondly the name `book` in the `fields` propery matters as we will use the same name `book` when we make queries from front end(or graphiql).
1.  The value of `type` property in `fields` is `BookType` which is the first Object Type we have defined for graphQL.
1.  There is another property called `args` or arguments. For ex. if a User is querying for a book then we expect the user to pass an argument or arguments (say id of that particular book, etc.) so that graphql knows exactly which book to show to the User.
1.  The `resolve` function takes two parameters `parents` and `args`. Inside the code block of this resolve function we write the code for whatever data( from database or any other source) the User is looking for in a particular query. The first parameter `parent` comes into play when we try to look into relationship between data or type objects( like between BookType and AuthorType, etc.). The second parameter `args` represents the `args` property's value defined in `book`( which is the value of `id` in our case).
1.  So, now our `schema.js` file looks like this:

```js
import graphql from "graphql";
const { GraphQLString, GraphQLObjectType, GraphQLSchema } = graphql;

// Our first type
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
});

//Our first root type or entry point in our graph
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from DB or any other source
      },
    },
  },
});

// Export this schema to our middleware defined in another file
export default new GraphQLSchema({
  query: RootQuery,
});
```

1. And our `app.js` will look like this:

```js
import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/schema.js";

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    // schema on RHS is from our schems.js
    schema: schema,
    // to use graphiql
    graphiql: true,
  })
);
const port = 4000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}..`);
});
```
