import mongoose from "mongoose";

const catchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    vessel_Name: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
    },
    fisherman: {
      type: String,
      trim: true,
    },
    vessel_Owned: {
      type: String,
      trim: true,
    },
    shore: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    tournament_name: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
    },
    specie: {
      type: String,
      trim: true,
    },
    line_strenght: {
      type: String,
      trim: true,
    },
    fish_width: {
      type: String,
      trim: true,
    },
    fish_length: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },
    latitude: {
      type: String,
      trim: true,
    },
    longitude: {
      type: String,
      trim: true,
    },
    weight: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("catches", catchSchema);
