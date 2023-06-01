import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
const port = process.env.PORT || 4001;

app.use(express.json());
app.use(cors());

dotenv.config();
const DB = ;
mongoose.connect(DB);

app.listen(port, () =>
  console.log(`server started on http://localhost:${port} `)
);
