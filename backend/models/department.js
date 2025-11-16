import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    categoryHandled: [
      {
        type: String,
        required: true,  
        trim: true,
      }
    ],

    contactEmail: {
      type: String,
      trim: true,
    },

    contactPhone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;
