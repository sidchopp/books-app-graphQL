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

- Now,we want that when a User queries for a particular author, a list of all the books by that author will also be received by the User.So, now we create a `books` property, which is an object, inside the `AuthorType`. The value of this property will be a `new GraphQLList` which takes `BookType` as a paramter. Remember `BookType` will give the User a particular book only and not a list of all books.So, we need to destructure `graphql` again and get ` GraphQLList` from it.

```js
import { GraphQLList} = graphhql;

// Let's add three  more books to our booksData
const booksData = [
  { name: " Name of the wind", id: "1", genre: "fiction", authorid: "1" },
  { name: " The Final Empire", id: "2", genre: "fantasy", authorid: "2" },
  { name: " The Long Earth", id: "3", genre: "sci-fi", authorid: "3" },
  { name: " The Hero of Ages", id: "4", genre: "fantasy", authorid: "2" },
  { name: " The Color of Magic", id: "5", genre: "fantasy", authorid: "3" },
  { name: "The Light Fantastic", id: "6", genre: "fantasy", authorid: "3" },
];

// Updated Author type

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      // to get a list of books by an Author
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        console.log(parent);
        // Now resovle fn will filter the books that belong to a particular author
        return booksData.filter((books) => books.authorid === parent.id);
      },
    },
  }),
});
```

- Now run the server, and in graphiql console write this code:

```js
{
  author(id: 3) {
    name
    age
    books {
      name
      genre
    }
  }
}

```

Press Start/play button of graphiql console and you will see this output:

```js
{
  "data": {
    "author": {
      "name": " Terry Patchett",
      "age": 66,
      "books": [
        {
          "name": " The Long Earth",
          "genre": "sci-fi"
        },
        {
          "name": " The Color of Magic",
          "genre": "fantasy"
        },
        {
          "name": "The Light Fantastic",
          "genre": "fantasy"
        }
      ]
    }
  }
}
```

- NOTE: The reason for using a function as the value of `fields` property for `AuthorType` or `BookType` is more meaningful now. Since we are referencing `Booktype` in `AuthorType` and vice versa, and it might be possible that `BookType` is defined after we have defined `AuthorType` in our `schema.js` file, so we will get an error if we had used an object and not a function as the value of `fields` property.

- Till now we have two root queries: one for finding a particular book from `booksData` and one for finding a particular author from `authorsData`. Let's define two more root queries to show a list of all the books from `booksData` and a list of all authors from `authorsData`. So, in our `RootQuery` we define two more fields by the name of `books` and `authors`.

```js
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      // Here resolve func. looks into the book data and returns what we want
      resolve(parent, args) {
        // code to get data from DB or any other source
        return booksData.find((book) => book.id === args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return authorsData.find((author) => author.id === args.id);
      },
    },
    // Two new root queries
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return booksData;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authorsData;
      },
    },
  },
});
```

- Start server and in graphiql console write:

```js
{
  books {
    name
    genre
  }
}
```

We get this output:

```js
{
  "data": {
    "books": [
      {
        "name": " Name of the wind",
        "genre": "fiction"
      },
      {
        "name": " The Final Empire",
        "genre": "fantasy"
      },
      {
        "name": " The Long Earth",
        "genre": "sci-fi"
      },
      {
        "name": " The Hero of Ages",
        "genre": "fantasy"
      },
      {
        "name": " The Color of Magic",
        "genre": "fantasy"
      },
      {
        "name": "The Light Fantastic",
        "genre": "fantasy"
      }
    ]
  }
}
```

If we write:

```js
{
  authors {
    name
    age
  }
}

```

We get this output:

```js
{
  "data": {
    "authors": [
      {
        "name": " Patrick Rothfuss",
        "age": 44
      },
      {
        "name": " Brandon Sanderson",
        "age": 42
      },
      {
        "name": " Terry Patchett",
        "age": 66
      }
    ]
  }
}
```

- NOTE: The best thing is that since we have type relation between books and authors so even we try something like this in graphiql:

```js
{
  books {
    name
    genre
    // We also want to know about the authors of all the books
    author {
      name
      age
    }
  }
}
```

The output we get is:

```js
{
  "data": {
    "books": [
      {
        "name": " Name of the wind",
        "genre": "fiction",
        "author": {
          "name": " Patrick Rothfuss",
          "age": 44
        }
      },
      {
        "name": " The Final Empire",
        "genre": "fantasy",
        "author": {
          "name": " Brandon Sanderson",
          "age": 42
        }
      },
      {
        "name": " The Long Earth",
        "genre": "sci-fi",
        "author": {
          "name": " Terry Patchett",
          "age": 66
        }
      },
      {
        "name": " The Hero of Ages",
        "genre": "fantasy",
        "author": {
          "name": " Brandon Sanderson",
          "age": 42
        }
      },
      {
        "name": " The Color of Magic",
        "genre": "fantasy",
        "author": {
          "name": " Terry Patchett",
          "age": 66
        }
      },
      {
        "name": "The Light Fantastic",
        "genre": "fantasy",
        "author": {
          "name": " Terry Patchett",
          "age": 66
        }
      }
    ]
  }
}

```

And if we write:

```js
{
  authors {
    name
   age
   // We also want to know about all the books written by all the authors
   books {
      name
      genre
    }
  }
}
```

We get output as:

```js
{
  "data": {
    "authors": [
      {
        "name": " Patrick Rothfuss",
        "age": 44,
        "books": [
          {
            "name": " Name of the wind",
            "genre": "fiction"
          }
        ]
      },
      {
        "name": " Brandon Sanderson",
        "age": 42,
        "books": [
          {
            "name": " The Final Empire",
            "genre": "fantasy"
          },
          {
            "name": " The Hero of Ages",
            "genre": "fantasy"
          }
        ]
      },
      {
        "name": " Terry Patchett",
        "age": 66,
        "books": [
          {
            "name": " The Long Earth",
            "genre": "sci-fi"
          },
          {
            "name": " The Color of Magic",
            "genre": "fantasy"
          },
          {
            "name": "The Light Fantastic",
            "genre": "fantasy"
          }
        ]
      }
    ]
  }
}
```

## MongoDB

Let's fireup a MongoDB instance, where we will store our data about books and authors.

- Install mongoose package in server folder so that our app can talk with MongoDB `npm i mongoose`
- Install dotenv package in server folder `npm i dotenv`
- Create a file `.env` in the server folder and inside that file store the connection string of the MongoDB instance( for security)
- Go to `app.js` file and add this code:

```js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//db connection
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.once("open", () => {
  console.log("connected to MongoDB...");
});
```

Fire up the server and you will see in the console:

```js
connected to MongoDB...
```

- Now, let's put the mongoDB connection logic in a seperate file `connect.js` inside a subfolder `db` inside `server ` folder. In `connect.js` write:

```js
import mongoose from "mongoose";

const connectDB = (url) => {
  const connectionDB = mongoose.connection.once("open", () => {
    console.log("connected to MongoDB...");
  });
  return mongoose.connect(url);
};

export default connectDB;
```

- In App.js, we first import this `connect.js` and then call the function `connectDB`:

```js
import connectDB from "./db/connect.js";

//db connection
connectDB(process.env.MONGO_URL);
```

- Now, let's create `mongoose` model/schema for our MongoDB. Create a new folder `models` and inside it create two files: `author.js` and `book.js`. Inside `book.js` write:

```js
import mongoose from "mongoose";
const { Schema } = mongoose;

const bookSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  genre: String,
  authorid: String,
  // We don't include id property as MongoDB creates it's own _id
});

const bookModel = mongoose.model("Book", bookSchema); //The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name. Thus, for the example above, the model Book is for the books collection in the database.

export default bookModel;
```

Inside `author.js` write:

```js
import mongoose from "mongoose";
const { Schema } = mongoose;

const authorSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  age: Number,
  // We don't include id property as MongoDB creates it's own _id
});

const authorModel = mongoose.model("Author", authorSchema);

export default authorModel;
```

And now we will import these two inside our `schema.js` file like this:

```js
import Book from "../models/book.js";
import Author from "../models/author.js";
```

#### Mutations in GraphQL

- To modify server-side data
- we can mutate and query the new value of a field with one request.
- While query fields are executed in parallel, mutation fields run in series, one after the other. This means that if we send two mutations in one request, the first is guaranteed to finish before the second begins, ensuring that we don't end up with a race condition with ourselves.

Let's go to `schema.js` file and at the bottom and write:

```js
// old code....

// To modify server-side data
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let author = new Author({
          // This Author on RHS comes from our mongoose models. So, we create a new instance of Author model and put its value in a variable named author
          name: args.name,
          age: args.age,
        });
        // To save the above data in our DB and to return it to User
        return author.save();
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
```

- ` author.save();` will save whatever values a User fills from Front End into the correct collection in our MongoDB and `return` key word will return that data to the User. Under the hood, mongoose is doing all this work. Now start server and in graphiql type:

```js
mutation {
  addAuthor(name: "Doe John", age: 35) {
    name
    age
  }
}
```

The output is:

```js
{
  "data": {
    "addAuthor": {
      "name": "Doe John",
      "age": 35
    }
  }
}
```

- In MongoDB Atlas, if we go to our collection we will see an entry/document:

```js
{"_id":{"$oid":"62c095355aea902d2b24b1e1"},"name":"Doe John","age":{"$numberInt":"35"},"__v":{"$numberInt":"0"}}

```

- Now let's delete this document from our MongoDB. And add the three real authors, one by one, from our dummy `authorsData` array in our MongoDB. And delete this dummy data from `schema.js`
