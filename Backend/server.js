import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Import Routers
import router from "./routes/emailRouter.js";
import itemRouter from "./routes/itemRouter.js";
import cartRouter from "./routes/cartRouter.js";
import loginrouter from "./routes/loginRouter.js";
import passwordRouter from "./routes/passwordRouter.js";
import addressRouter from "./routes/addressRouter.js";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

// Start the Server
const PORT = process.env.PORT || 3002;

app.use(router);
app.use(express.static("public"));
app.use(itemRouter);
app.use(cartRouter);
app.use(loginrouter);
app.use(passwordRouter);
app.use(addressRouter);

app.listen(PORT, async () => {
  console.log(` Server running on http://localhost:${PORT}`);
  await connectDB(); // Connect to MongoDB after starting the server
});

export default connectDB;
