import graphql from 'graphql';

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID
} = graphql;

//Dummy data till we create a mongoDB instance for a real DB
const booksData = [
  { name: " Gone with the wind", id: "1", genre: "fiction" },
  { name: " Interstellar", id: "2", genre: "Sci-fi" },
  { name: " 3 idiots", id: "3", genre: "fiction" },
]

// Construct a schema, using GraphQL schema language
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString }
  })
});

// The root provides a resolver function for each API endpoint
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from DB or any other source
        return booksData.find(book => book.id === args.id)
      }
    }
  }
});

export default new GraphQLSchema({
  query: RootQuery
});




