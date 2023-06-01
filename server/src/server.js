import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = process.env.PORT || 4001;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const DB = process.env.DB;
mongoose.connect(DB);

app.get("/", (req, res) => {
  const docId = uuidv4();
  res.send({ docId });
});

app.post("/:docId", (req, res) => {
  const { docId } = req.params;
  const { delta, oldDelta, source } = req.body;
  console.log(docId, { delta, oldDelta, source });
});

app.listen(port, () =>
  console.log(`server started on http://localhost:${port} `)
);
