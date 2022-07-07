import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "../queries/queries";

//Components
import BookDetails from "./BookDetails";

// This BookList component will execute our GET_BOOKS query with useQuery hook
const BookList = () => {
  const { loading, error, data } = useQuery(GET_BOOKS);
  // console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  // To SHow all Books
  const showBooks = data.books.map(({ id, name }) => {
    return (
      <div key={id}>
        <ul id="book-list">{name}</ul>
      </div>
    );
  });

  return (
    <div>
      {showBooks}
      <BookDetails />
    </div>
  );
};

export default BookList;
<BookDetails />;
