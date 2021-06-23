import { Schema, model } from "mongoose";

const userGroupSchema = new Schema(
  {
    user: { type: Schema.Types.Array },
  },
  { timestamps: true, versionKey: false }
);

const UserGroup = new model("UserGroup", userGroupSchema);

export default UserGroup;