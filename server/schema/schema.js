import graphql from "graphql";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

//Dummy data till we create a mongoDB instance for a real DB...
const booksData = [
  { name: " Name of the wind", id: "1", genre: "fiction", authorid: "1" },
  { name: " The Final Empire", id: "2", genre: "fantasy", authorid: "2" },
  { name: " The Long Earth", id: "3", genre: "sci-fi", authorid: "3" },
  { name: " The Hero of Ages", id: "4", genre: "fantasy", authorid: "2" },
  { name: " The Color of Magic", id: "5", genre: "fantasy", authorid: "3" },
  { name: "The Light Fantastic", id: "6", genre: "fantasy", authorid: "3" },
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
        //Here the parent parameter has access to that book(and its properties)  which the User has asked for.
        // console.log(parent);
        // return authorsData.find((parent) => parent.id === args.authorid);
        return authorsData.find((author) => {
          // console.log(author);
          return author.id === parent.authorid;
        });
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
    books: {
      // to get a list of books
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        console.log(parent);
        // Now resovle fn will filter the books that belong to a particular author
        return booksData.filter((books) => books.authorid === parent.id);
      },
    },
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

export default new GraphQLSchema({
  query: RootQuery,
});
