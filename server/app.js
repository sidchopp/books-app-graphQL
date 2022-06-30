import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/schema.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
//db connection
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.once("open", () => {
  console.log("connected to MongoDB...");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    // rootValue: root,
    graphiql: true,
  })
);
const port = 4000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}..`);
});
