import { useQuery } from "@apollo/client";
import { GET_BOOK } from "../queries/queries";

const BookDetails = ({ bookid }) => {
  const { id } = bookid;
  console.log(id);
  const { loading, error, data } = useQuery(GET_BOOK);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  return (
    <div id="book-details">
      <p>Output Book details here..{id}</p>
    </div>
  );
};

export default BookDetails;
