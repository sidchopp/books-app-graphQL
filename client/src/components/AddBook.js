import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_AUTHORS, ADD_BOOK, GET_BOOKS } from "../queries/queries";

const AddBook = () => {
  //States

  const [bookInfo, setBookInfo] = useState({
    bookName: "",
    genre: "",
    authorid: "",
  });

  //Event Handlers

  const handleChange = (e) => {
    const name = e.target.name; //name corresponds to the name attribute in each input field
    const value = e.target.value; //value is what a User writes in each input fields
    setBookInfo({ ...bookInfo, [name]: value }); // ...Spread operator to get all the previous values of bookInfo states and the [] notation then dynamically adds to the state whatever a User fills
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // To make sure User fills all input fields
    if (bookInfo.bookName && bookInfo.genre && bookInfo.authorid) {
      console.log(bookInfo);
      // Calling Mutate function
      mutateFunction({
        variables: {
          name: bookInfo.bookName,
          genre: bookInfo.genre,
          authorid: bookInfo.authorid,
        },
        // for refetching query
        refetchQueries: [{ query: GET_BOOKS }],
      });
    }
  };

  // Destructuring the output of query/mutation
  const { loading, error, data } = useQuery(GET_AUTHORS);
  // console.log(data);
  const [
    mutateFunction,
    { data: addBookData, loading: addBookLoading, error: addBookError },
  ] = useMutation(ADD_BOOK);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //To show all the Authors
  const showAuthors = data.authors.map(({ name, id }) => {
    return (
      <option key={id} value={id}>
        {/* <li>{name}</li> */}
        {name}
      </option>
    );
  });

  return (
    <form id="add-book" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="bookName">Book Name:</label>
        <input
          id="bookName" // corresponds to htmlFor attribute of label
          type="text"
          name="bookName"
          value={bookInfo.bookName} // state value
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label htmlFor="genre">Genre:</label>
        <input
          id="genre" // corresponds to htmlFor attribute of label
          type="text"
          name="genre"
          value={bookInfo.genre} // state value
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label htmlFor="authorID">Author:</label>
        <select
          id="authorID" // corresponds to htmlFor attribute of label
          name="authorid"
          value={bookInfo.authorid} // state value
          onChange={handleChange}
        >
          <option>Select Author </option>
          {showAuthors} {/* To show the list of Authors in the dropdown */}
        </select>
      </div>
      <button>+</button>
    </form>
  );
};

export default AddBook;
