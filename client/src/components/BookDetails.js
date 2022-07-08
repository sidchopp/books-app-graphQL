import { useQuery } from "@apollo/client";
import { GET_BOOK } from "../queries/queries";

const BookDetails = ({ bookid }) => {
  // console.log(bookid);
  const { loading, error, data } = useQuery(GET_BOOK, {
    variables: bookid,
  });

  // console.log(bookid);
  // console.log(data);

  if (loading) return <p>Loading ...</p>;
  if (error) return `Error! ${error.message}`;

  //To display book contents
  const { book } = data;
  const displayBookDetails = () => {
    if (book) {
      return (
        <div>
          <h2>{book.name}</h2>
          <p>{book.genre}</p>
          <p>{book.author.name}</p>
          <p>Other book by this Author</p>
          <ul className="other-books">
            {book.author.books.map((item) => {
              return <li key={item.id}>{item.name}</li>;
            })}
          </ul>
        </div>
      );
    } else {
      return <div>No Book Selected!</div>;
    }
  };

  return <div id="book-details">{displayBookDetails()}</div>;
};

export default BookDetails;
