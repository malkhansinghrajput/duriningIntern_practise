import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true }, // e.g., task:create, user:delete
  description: String,
  resource: String, // e.g., task, user
  action: String // e.g., create, read, update, delete
}, { timestamps: true });

export default mongoose.model("Permission", permissionSchema);