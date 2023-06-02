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
  // console.log({ docs });
  const docData = docs.map((doc) => {
    return { docId: doc._id, docName: doc.name };
  });
  res.send({ docData });
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
      await new Document({
        _id: docId,
        data: deltaData,
        name: "Untitled",
      }).save();
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

app.post("/:docId/rename", async (req, res) => {
  const { docId } = req.params;
  const { docName } = req.body;
  // console.log({ docName, docId });
  try {
    const doc = await Document.findOne({ _id: docId }).exec();
    doc.name = docName;
    await doc.save();
  } catch (err) {
    console.error(err);
  } finally {
    res.sendStatus(204);
  }
});

app.delete("/:docId/delete", async (req, res) => {
  const { docId } = req.params;
  // console.log({ docId });
  try {
    const doc = await Document.deleteOne({ _id: docId }).exec();
    res.send({ acknowledged: doc?.acknowledged });
    console.log({ doc });
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

app.get("/:docId", async (req, res) => {
  const { docId } = req.params;
  const doc = await Document.findOne({ _id: docId }).exec();
  const docName = doc?.name;
  const data = doc?.data;
  // console.log(data);
  if (data) {
    res.send({ data, docName });
  } else {
    res.send({ msg: "Created" });
  }
});

app.listen(port, () =>
  console.log(`server started on http://localhost:${port} `)
);
