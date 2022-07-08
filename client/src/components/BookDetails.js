import { useQuery } from "@apollo/client";
import { GET_BOOK } from "../queries/queries";

const BookDetails = ({ bookid }) => {
  // console.log(bookid);
  const { loading, error, data } = useQuery(GET_BOOK, {
    variables: bookid,
  });
  console.log(bookid);
  console.log(data);

  if (loading) return <p>Loading ...</p>;
  if (error) return `Error! ${error.message}`;

  return (
    <div id="book-details">
      <p>Output Book details here..</p>
    </div>
  );
};

export default BookDetails;
