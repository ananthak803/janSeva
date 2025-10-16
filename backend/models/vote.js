import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Resident", required: true },
}, { timestamps: true });

export default mongoose.model("Vote", voteSchema);
