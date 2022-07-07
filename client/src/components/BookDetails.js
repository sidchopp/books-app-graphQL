import { useQuery } from "@apollo/client";
import { GET_BOOK } from "../queries/queries";

const BookDetails = () => {
  const { loading, error, data } = useQuery(GET_BOOK);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  return (
    <div id="book-details">
      <p>Output Book details here..</p>
    </div>
  );
};

export default BookDetails;
