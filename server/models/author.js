import mongoose from "mongoose";
const { Schema } = mongoose;

const authorSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  age: Number,
  // We don't include id property as MongoDB creates it's own _id
});

const authorModel = mongoose.model("Author", authorSchema);

export default authorModel;
