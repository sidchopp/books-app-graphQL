import graphql from "graphql";
import Book from "../models/book.js";
import Author from "../models/author.js";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

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

        // return authorsData.find((author) => {
        //   // console.log(author);
        //   return author.id === parent.authorid;
        // });

        //returning from authors collection in MongoDB
        return Author.findById(parent.authorid);
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
        // return booksData.filter((books) => books.authorid === parent.id);

        //returning from books collection in MongoDB
        return Book.find({ authorid: parent.id });
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
        // return booksData.find((book) => book.id === args.id);

        //returning from books collection in MongoDB
        return Book.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      // Here resolve func. looks into the author data and returns what we want
      resolve(parent, args) {
        // code to get data from DB or any other source
        // return authorsData.find((author) => author.id === args.id);

        //returning from authors collection in MongoDB
        return Author.findById(args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return booksData;

        //returning all books from books collection in MongoDB
        return Book.find({});
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authorsData;

        //returning all authors from authors collection in MongoDB
        return Author.find({});
      },
    },
  },
});

// To modify server-side data, we use mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // To add an Author
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        let author = new Author({
          // This Author on RHS comes from our mongoose models. So, we create a new instance of Author model and put its value in a variable named author
          name: args.name, //values filled by User
          age: args.age,
        });
        // To save the above data in our DB and to return it to User
        return author.save();
      },
    },
    // To add a Book
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorid: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let book = new Book({
          // This Book on RHS comes from our mongoose models. So, we create a new instance of Book model and put its value in a variable named book
          name: args.name, //values filled by User
          genre: args.genre,
          authorid: args.authorid,
        });
        // To save the above data in our DB and to return it to User
        return book.save();
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
