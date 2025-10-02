import mongoose from "mongoose";

const ResidentSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone:{
    type:String,
    required:true,
    unique:true,
  },
  password_hash: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["resident"],
    default: "resident"
  },

  address: {
    type: String
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],  
      index: "2dsphere"
    }
  },

  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue"
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Resident = mongoose.model("Resident", ResidentSchema);

export default Resident;
