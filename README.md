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

- Start a command shell (CMD, PowerShell, Terminal, etc.)
- Make a directory/folder for your work: `mkdir books-app-graphQL`
- `cd books-app-graphQL`
- Make a subfolder by the name of `server`
- `cd server`
- To use import (and not require in Node), write : `"type": "module"` in package.json. Make sure to write files with `.js` extensions while importing now.

- Start VS Code for this project: `code .`

## For Express

- Now install Express : `npm install express --save`
- Inside the server folder create a file `app.js` and write the following code in it:

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

- Install a package called nodemon which automatically restart the node application when file changes in the directory are detected. : `npm install --save-dev nodemon`
- In package.json file, in `scripts` add:
  `{"start": "nodemon app.js"},`
- To start the Node server, write : `node start`

## For GraphQL

- From `server` folder run:

```js
 npm install graphql express-graphql
```

The first package `graphql` is the main graphQL package which is a JavaScript implementation of GraphQL. The second package `express-graphql` will help our express server to understand/talk with graphQL

- Inside `app.js`, write:
  ```js
  import { graphqlHTTP } from "express-graphql";
  ```
- For middleware, also write:

  ```js
  app.use("/graphql", graphqlHTTP({}));
  ```

- In the above step, we have created a single endpoint `/graphql`, to which we will send all our graphQL queries. So, anyone sends a request to this endpoint, `graphqlHTTP` function will be fired. This function takes an object which we will talk about in next step. If we run our server now we get an error:

  ```js
  {"errors":[{"message":"GraphQL middleware options must contain a schema."}]}
  ```

- To avoid this error, we need to pass in a `schema` in the `app.use` middleware. That `schema` will tell our express graphql server about our data types and how they are related, their properties, etc. The basic purpose of `schema` here is to jump to different points in our graph and to retrieve or mutate our data. So, we first create a `schema` and then pass it into the `app.use` middleware so that graphql knows exactly how to deal with our data queries.

### Schema and Type

- Create a subfolder named `schema` in the `server` folder and inside it create a new file `schema.js`. Inside this file write:

```js
import graphql from "graphql";
const { GraphQLObjectType } = graphql;
```

- Here we have imported graphql in our schema.js file and then using destructuring we defined a function `GraphQLObjectType` which takes an object as a parameter.

- Let's define an Object type here, say `BookType`.

```js
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({}),
});
```

- This object parameter that we will pass to the function `GraphQLObjectType` will define what this BookType is all about. Then we include key-value pairs( or properties) in this object like `name`, `fields`. This `fields` property is going to be a function. The reason that `fields` here is a function because when we have multiple types and they have references to each other, then one type will know what other type is. Now, this `fields` function will return an object and we define all our fields like `id`, `name`, `genre` (and their type which is only understood by graphql) in this object. So, we again destructure `graphql` to further obtain those special types, like:

```js
import graphql from "graphql";
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;
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

- So, above we have defined our first type called `BookType` and then we gave it a `name` and defined its `fields` and also the `type` of those fields. Now, it's time to pass this `schema` into the `app.use` middleware, so that we can make queries to our data( which we have not defined yet). Such queries are called root queries. The `schema.js` file has 3 responsibilities- to define types( for ex BookType), to define relationships between types( for ex between BookType and AuthorType, which we will create later) and to define root queries( which means the entry points into a graph). Let's create a root query in this file:

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

- Things to remember about root queries:

1.  We don't have to wrap `fields` of RootQuery in a function(unlike we did in `BookType`).
1.  The name `book` in the `fields` propery matters as we will use the same name `book` when we make queries from front end(or graphiql).
1.  The value of `type` property in `fields` is `BookType` which is the first Object Type we have defined for graphQL.
1.  There is another property called `args` or arguments. For ex. if a User is querying for a book then we expect the user to pass an argument or arguments (say id of that particular book, etc.) so that graphql knows exactly which book to show to the User.
1.  The `resolve` function takes two parameters `parents` and `args`. Inside the code block of this resolve function we write the code for whatever data( from database or any other source) the User is looking for in a particular query. The first parameter `parent` comes into play when we try to look into relationship between data or type objects( like between BookType and AuthorType, etc.). The second parameter `args` represents the `args` property's value defined in `book`( which is the value of `id` in our case).

- So, now our `schema.js` file looks like this:

```js
import graphql from "graphql";
const { GraphQLString, GraphQLObjectType, GraphQLSchema, GraphQLID } = graphql;

// Our first type
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
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

- And our `app.js` will look like this:

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

### Dummy data

Let's create some data. Later on we will be using a MongoDB database for this. In `schema.js` we create a `bookData` array and in the `resolve` function of `RootQuery` we are using this `bookData`:

```js
const booksData = [
  { name: " Name of the wind", id: "1", genre: "fiction" },
  { name: " The Final Empire", id: "2", genre: "fantasy" },
  { name: " The Long Earth", id: "3", genre: "sci-fi" },
];

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from DB or any other source
        return booksData.find((book) => book.id === args.id);
      },
    },
  },
});
```

- Now, start the server and type `http://localhost:4000/graphql` and it will open a graphiQL tool and on Left side write:

```js
{
  book(id: 1) {
    name
    genre
  }
}
```

- Now, press the start/play button and you will see this query's output on Right side, which is like this:

```js
{
  "data": {
    "book": {
      "name": " Name of the wind",
      "genre": "fiction"
    }
  }
}
```

- Let's define another Object type here, say `AuthorType`, just like we have created `BookType` earlier.Then we create an array which has a list of Authors called `authorsData` just like we have created `booksData`. And since we are using integer values in the `age` property of `authorsData`, so we will destructure `graphql` again to get `GraphQLInt` :

```js
const { GraphQLInt } = graphql;

// Some dummy data about authors
const authorsData = [
  { name: " Patrick Rothfuss", age: 44, id: "1" },
  { name: " Brandon Sanderson", age: 42, id: "2" },
  { name: " Terry Patchett", age: 66, id: "3" },
];

// The Author type //
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});
```

- Now we will also create root query for this `AuthorType` to query about authors, just like we have created root query for querying about books. So, the root query for both books and authors will look like this:

```js
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // root query for books
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return booksData.find((book) => book.id === args.id);
      },
    },
    // root query for authors
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return authorsData.find((author) => author.id === args.id);
      },
    },
  },
});
```

- Now, start the server and type `http://localhost:4000/graphql` and it will open a graphiQL tool and on Left side write:

```js{
  author(id: 3){
    name
    age
  }
}
```

- Now, press the start/play button and you will see this query's output on Right side, which is like this:

```js
{
  "data": {
    "author": {
      "name": " Terry Patchett",
      "age": 66
    }
  }
}
```

### Types-Relation

Now, we have 2 objects types: `BookType` and `AuthorType`. We know that every book has an author and every author has written one or more books.So, we can relate these two together. Let's create a way so that GraphQL knows which book belongs to which author.Steps to do that:

- We first go to our `booksData` and add an `authorid` property for each element. This `authorid` should match with the `id` property on `authorsdata`. This sets up a relationship between books and their authors.For ex (shown below): The book called Name of the wind(`authorid: "1"`) is written by Partick Rothfuss(`id: "1"`)

```js
const booksData = [
  { name: " Name of the wind", id: "1", genre: "fiction", authorid: "1" },
  { name: " The Final Empire", id: "2", genre: "fantasy", authorid: "2" },
  { name: " The Long Earth", id: "3", genre: "sci-fi", authorid: "3" },
];

const authorsData = [
  { name: " Patrick Rothfuss", age: 44, id: "1" },
  { name: " Brandon Sanderson", age: 42, id: "2" },
  { name: " Terry Patchett", age: 66, id: "3" },
];
```

- Now, when a User asks for a book, we want to send the author of that book too. So, we add a property called `author` in the `BookType`. The value of the `author` will be an object with properties like `type` and `resolve(parent, args)` function. Here `parent` represents the book the User has asked for. So, `parent` has access to all the properties of that book which the user has asked for. So, now our `BookType` looks like this:

```js
// The book type //
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    // Relationship between book type and author type
    author: {
      type: AuthorType,
      // Here resolve func. looks into the author data and looks for the author of the book and returns what we want
      resolve(parent, args) {
        //Here the parent parameter has access to that book(and its properties)  which the User has asked for.
        console.log(parent);
        return authorsData.find((author) => {
          console.log(author);
          return author.id === parent.authorid;
        });
      },
    },
  }),
});
```

- Now fire up the server like before and in graphiql, write and press start/play button:

```js
{
  book(id: 3) {
    name
    genre
    author {
      name
      age
      id
    }
  }
}


```

- This will be the output you see:

```js
{
  "data": {
    "book": {
      "name": " The Long Earth",
      "genre": "sci-fi",
      "author": {
        "name": " Terry Patchett",
        "age": 66,
        "id": "3"
      }
    }
  }
}
```
