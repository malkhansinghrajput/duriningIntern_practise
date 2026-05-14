import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({

  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

resource: {
  type: String,
  enum: ["task", "user"]
},

 action: {
  type: String,
  enum: [
    "create",
    "read",
    "update",
    "delete",
    "assign",
    "manage",
    "promote",
    "my",
    "status",

  ],
}

}, {
  timestamps: true
});

export default mongoose.model("Permission", permissionSchema);