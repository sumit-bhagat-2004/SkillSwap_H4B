import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(`DB connected ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to db, ${error}`);
  }
};
