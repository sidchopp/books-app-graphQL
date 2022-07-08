import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "../queries/queries";
import { useState } from "react";

//Components
import BookDetails from "./BookDetails";

// This BookList component will execute our GET_BOOKS query with useQuery hook
const BookList = () => {
  //States
  const [selected, setSelected] = useState(null);

  const { loading, error, data } = useQuery(GET_BOOKS);
  // console.log(data);
  if (error) return <p>Error :(</p>;

  // To Show all Books
  const showBooks = () => {
    if (loading) {
      return <div>Loading books..</div>;
    } else {
      return data.books.map(({ id, name }) => {
        // Event Handlers
        const handleClick = (e) => {
          setSelected({ id });
        };
        return (
          <li key={id} onClick={handleClick}>
            {name}
          </li>
        );
      });
    }
  };

  return (
    <div>
      <ul id="book-list">{showBooks()}</ul>
      <BookDetails bookid={selected} />
    </div>
  );
};

export default BookList;
