import mongoose from "mongoose";

const rolePermissionSchema = new mongoose.Schema({
  role: { type: String, enum: ["super_admin", "admin", "user"], required: true },
  permission: { type: mongoose.Schema.Types.ObjectId, ref: "Permission", required: true },
  grantedAt: { type: Date, default: Date.now }
}, { timestamps: true });

rolePermissionSchema.index({ role: 1, permission: 1 }, { unique: true });

export default mongoose.model("RolePermission", rolePermissionSchema);