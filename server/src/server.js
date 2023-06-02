import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import Delta from "quill-delta";
import Document from "./schema.js";

const app = express();
const port = process.env.PORT || 4001;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const DB = process.env.DB;
mongoose.connect(DB);

app.get("/", async (req, res) => {
  const docs = await Document.find({}).exec();
  console.log({ docs });
  const docIds = docs.map((doc) => doc._id);
  res.send({ docIds });
});

app.get("/create", (req, res) => {
  const docId = uuidv4();
  res.send({ docId });
});

app.post("/:docId", async (req, res) => {
  const { docId } = req.params;
  const { delta, oldDelta } = req.body;
  try {
    const doc = await Document.findOne({ _id: docId }).exec();
    const deltaData = new Delta(oldDelta).compose(new Delta(delta));
    if (!doc) {
      await new Document({ _id: docId, data: deltaData }).save();
    } else {
      doc.data = deltaData;
      await doc.save();
    }
  } catch (err) {
    console.error(err);
  } finally {
    res.sendStatus(201);
  }
});

app.get("/:docId", async (req, res) => {
  const { docId } = req.params;
  const doc = await Document.findOne({ _id: docId }).exec();
  const data = doc?.data;
  // console.log(data);
  if (data) {
    res.send(data);
  } else {
    res.send({ msg: "Created" });
  }
});

app.listen(port, () =>
  console.log(`server started on http://localhost:${port} `)
);
