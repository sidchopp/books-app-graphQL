import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

//Components
import BookList from "./components/BookList";
import AddBook from "./components/AddBook";

//Apolo Client set up
const client = new ApolloClient({
  uri: "https://books-server-vercel.vercel.app/graphql",
  cache: new InMemoryCache(),
});

console.log("client", client);
function App() {
  return (
    <ApolloProvider client={client}>
      <div id="main">
        <header className="header">
          <h1>My Reading List</h1>
        </header>
        <BookList />
        <AddBook />
      </div>
    </ApolloProvider>
  );
}

export default App;
