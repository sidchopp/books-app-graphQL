import { gql } from "@apollo/client";

//To define the query we want to execute, we wrap it in the gql template literal

//To get all Books
const GET_BOOKS = gql`
  query GetBooks {
    books {
      name
      id
    }
  }
`;

//To get all Authors
const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      name
      id
    }
  }
`;

//To add a new book, we use mutation
const ADD_BOOK = gql`
  mutation AddBook {
    addBook(name: "", genre: "", authorid: "") {
      name
      id
    }
  }
`;

export { GET_BOOKS, GET_AUTHORS, ADD_BOOK };
