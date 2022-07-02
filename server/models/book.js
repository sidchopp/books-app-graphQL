import mongoose from "mongoose";
const { Schema } = mongoose;

const bookSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  genre: String,
  authorid: String,
  // We don't include id property as MongoDB creates it's own _id
});

const bookModel = mongoose.model("Book", bookSchema); //The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name. Thus, for the example above, the model Book is for the books collection in the database.

export default bookModel;
