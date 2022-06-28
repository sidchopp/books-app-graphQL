# About this project

It is a learning project on GraphQL, a query language for APIs. I work on this project while following a great tutorial on youtube by the "The Net Ninja" and simultaneously going through the official documentation on <a href="https://graphql.org/" target="_blank"  > GraphQL</a>.

## Server

A GraphQL server is built on Node.js using Express. Here we have defined how our graph looks, different types of data on our graph, relationship between those data types, set different entry points into the graph. To initially test the graphQL server, a tool called Graphiql that helps to structure/test GraphQL queries correctly is also used.

## Database

This GraphQL server is connected with a MongoDB instance, where our Data(Books, Authors, etc.) is actually stored. It's not necessary to use MongoDB ( a nonSQL db) here, once can use any SQL db too

## Client

A React Client is built that talks to the GraphQL Server and gets the requested data which is stored in the MongoDB. It's not necessary to use React here, one can use Angular, Vue or any other Front-end framwork.

## Full Stack over view

Client(Browser) <----> Server(Node.js) <---> DataBase(MongoDB)

## Steps I followed

1. Start a command shell (CMD, PowerShell, Terminal, etc.)
1. Make a directory/folder for your work: `mkdir books-app-graphQL`
1. `cd books-app-graphQL`
1. Make a subfolder by the name of `server`
1. `cd server`
1. To use import (and not require in Node), write : `"type": "module"` in package.json. Make sure to write files with `.js` extensions while importing now.
1. Start VS Code for this project: `code .`
1. Now install Express : `npm install express --save`
1. Inside the server folder create a file `app.js` and write the following code in it
   `import express from 'express';`

`const app = express();`

`app.get('/', (req, res) => {`
`res.send("<h1>Hello World!</h1>")`
`});`

`app.listen(port, () => {`
`console.log(`Server is listening on port ${port}..`)`
`});`
