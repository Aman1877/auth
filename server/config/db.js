import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  try {
    const connec = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected to MongoDb ${connec.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`Error in mongodb ${error}`.bgRed.white);
  }
};
