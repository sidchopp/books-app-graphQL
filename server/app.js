import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import schema from "./schema/schema.js";
import connectDB from "./db/connect.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());

//db connection
connectDB(process.env.MONGO_URL);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    // rootValue: root,
    graphiql: true,
  })
);
const PORT = process.env.PORT || 4000;

// app.get("/", (req, res) => {
//   res.send("<h1>Hello World!</h1>");
// });

// To test server deployment
app.get("/", (req, res) => {
  res.json("Server deployed sucessfully");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}..`);
});
