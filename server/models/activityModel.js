import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    activity: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

export default mongoose.model("activity", activitySchema);
