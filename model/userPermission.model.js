import mongoose from "mongoose";

const userPermissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  permission: { type: mongoose.Schema.Types.ObjectId, ref: "Permission", required: true },
  type: { type: String, enum: ["allow", "deny"], default: "allow" },
  grantedAt: { type: Date, default: Date.now }
}, { timestamps: true });

userPermissionSchema.index({ user: 1, permission: 1 }, { unique: true });

export default mongoose.model("UserPermission", userPermissionSchema);