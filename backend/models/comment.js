import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Resident", required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
