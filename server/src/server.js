import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import Delta from "quill-delta";
import Document from "./schema.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const DB = process.env.DB;
mongoose.connect(DB);

// route to get all document ids and name
app.get("/", async (req, res) => {
  try {
    const docs = await Document.find({}).exec();
    const docData = docs.map((doc) => {
      return { docId: doc._id, docName: doc.name };
    });
    res.send({ docData });
  } catch (err) {
    console.error(err);
    res.sendStatus(501);
  }
});

// route create new document
app.get("/create", (req, res) => {
  try {
    const docId = uuidv4();
    res.send({ docId });
  } catch (err) {
    console.error(err);
    res.sendStatus(501);
  }
});

// document update route
app.post("/:docId", async (req, res) => {
  try {
    const { docId } = req.params;
    const { delta, oldDelta } = req.body;
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
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(501);
  }
});

//rename document
app.post("/:docId/rename", async (req, res) => {
  try {
    const { docId } = req.params;
    const { docName } = req.body;
    const doc = await Document.findOne({ _id: docId }).exec();
    if (!doc) {
      await new Document({
        _id: docId,
        data: new Delta(),
        name: docName,
      }).save();
    } else {
      doc.name = docName;
      await doc.save();
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(501);
  }
});

// delete document
app.delete("/:docId/delete", async (req, res) => {
  try {
    const { docId } = req.params;
    const doc = await Document.deleteOne({ _id: docId }).exec();
    res.send({ acknowledged: doc?.acknowledged });
    // console.log({ doc });
  } catch (err) {
    console.error(err);
    res.sendStatus(501);
  }
});

app.get("/:docId", async (req, res) => {
  try {
    const { docId } = req.params;
    const doc = await Document.findOne({ _id: docId }).exec();
    const docName = doc?.name;
    const data = doc?.data;
    if (data) {
      res.send({ data, docName });
    } else {
      res.send({ msg: "Created" });
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(501);
  }
});

const port = process.env.PORT || 4001;

app.listen(port, () =>
  console.log(`server started on http://localhost:${port} `)
);
