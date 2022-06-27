import graphql from "graphql";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
} = graphql;

//Dummy data till we create a mongoDB instance for a real DB...
const booksData = [
  { name: " Gone with the wind", id: "1", genre: "fiction", authorid: "1" },
  { name: " Interstellar", id: "2", genre: "Sci-fi", authorid: "2" },
  { name: " 3 idiots", id: "3", genre: "fiction", authorid: "3" },
];

const authorsData = [
  { name: " Patrick Rothfuss", age: 44, id: "1" },
  { name: " Brandon Sanderson", age: 42, id: "2" },
  { name: " Terry Patchett", age: 66, id: "3" },
];

// Construct a schema, using GraphQL schema language...

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
        //Here parent equals that book(from booksData ) whose author we want from resolve func.
        console.log(parent);
        return authorsData.find((parent) => parent.authorid === args.id);
      },
    },
  }),
});

// The Author type //
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

// The root provides a resolve function( that takes two parameters) for each API endpoint
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
      // Here resolve func. looks into the author data and returns what we want
      resolve(parent, args) {
        // code to get data from DB or any other source
        return authorsData.find((author) => author.id === args.id);
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
