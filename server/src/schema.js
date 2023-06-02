import { Schema, model } from "mongoose";

const documentSchema = new Schema({
  _id: String,
  name: String,
  data: Object,
});

const Document = model("Document", documentSchema);
export default Document;
