import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", required: true },
  text: { type: String, required: true },
  commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Resident" },
  date: { type: String, required: true },
  time: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
