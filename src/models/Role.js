import mongoose from "mongoose";

export const ROLES = ["admin", "user", "asesor"];

const roleSchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Role", roleSchema);
