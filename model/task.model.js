import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending"
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  image: String,
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  dueDate: Date
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);