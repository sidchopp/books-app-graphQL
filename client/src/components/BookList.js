import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "../queries/queries";

// This BookList component will execute our GET_BOOKS query with useQuery hook
const BookList = () => {
  const { loading, error, data } = useQuery(GET_BOOKS);
  // console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.books.map(({ id, name }) => (
    <div key={id}>
      <li>{name}</li>
      <br />
    </div>
  ));
};

export default BookList;
