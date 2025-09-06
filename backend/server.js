import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
 
const app = express();
app.use(cors({
  origin: "https://univibe-two.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));

const start = async()=>{
    const connectDB = await mongoose.connect("mongodb+srv://UniVibe:k9sHf31Gm4teBaiM@univibe.ndu9on0.mongodb.net/?retryWrites=true&w=majority&appName=UniVibe");
    app.listen(9090,()=>{
        console.log("server is listening on port 9090");
    })
};
start();