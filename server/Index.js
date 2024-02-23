import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import colors from "colors";
import productsRoute from "./routes/productRoutes.js";
import userRoute from "./routes/userRoutes.js";

// Configure env (its in our root folder thats why we dont need to define path)
dotenv.config();

// Database Config
connectDB();

// App
const app = express();

// middlewares
app.use(express.json()); //to parse JSON data sent in the request body
app.use(cookieParser());

// Routes
app.use("/api/v1/product", productsRoute);
app.use("/api/v1/user", userRoute);

// Dummy API
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Port number
const PORT = 8000 || process.env.PORT;

// Server listening
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`.bgBlue.black);
});
