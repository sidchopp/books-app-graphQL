import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema.js';

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  // rootValue: root,
  graphiql: true,
}));
const port = 4000;

app.get('/', (req, res) => {
  res.send("<h1>Hello World!</h1>")
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}..`)
});