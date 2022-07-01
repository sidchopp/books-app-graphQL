import mongoose from "mongoose";

// mongoose return a promise, so we set async/await later
const connectDB = (url) => {
  const connectionDB = mongoose.connection.once("open", () => {
    console.log("connected to MongoDB...");
  });
  return mongoose.connect(url);
};

export default connectDB;
