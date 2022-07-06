import { useQuery } from "@apollo/client";
import { GET_AUTHORS } from "../queries/queries";

const AddBook = () => {
  const { loading, error, data } = useQuery(GET_AUTHORS);
  //   console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  //To show all the Authors
  const showAuthors = data.authors.map(({ name, id }) => {
    return (
      <option key={id} value={id}>
        <li>{name}</li>
      </option>
    );
  });

  return (
    <form id="add-book">
      <div className="field">
        <label htmlFor="">Book Name:</label>
        <input type="text" />
      </div>

      <div className="field">
        <label htmlFor="">Genre:</label>
        <input type="text" />
      </div>

      <div className="field">
        <label>Author:</label>
        <select>
          <option>Select Author </option>
          {/* To show the list of Authors in the dropdown */}
          {showAuthors}
        </select>
      </div>
      <button>+</button>
    </form>
  );
};

export default AddBook;
