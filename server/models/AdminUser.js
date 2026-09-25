import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password_hash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "admin",
    },

    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

const AdminUser =
  mongoose.models.AdminUser ||
  mongoose.model("AdminUser", adminUserSchema, "admin_users");

export default AdminUser;
