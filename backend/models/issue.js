import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Resident" },
  voteCount: { type: Number, default: 0 },
}, { timestamps: true });

issueSchema.index({ location: "2dsphere" }); // important for geo queries

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
