import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [3, "Name must be at least 2 characters"],
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
    phone: {
      type: String,
      unique: [true, "Phone number already exists"],
      default: "",
    },
    userName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      // minlength: [8, "Password must be at least 8 characters"],
    },
    vessel_Name: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXh8GtQ-rC09WMPBlX0LamjUpFhR_CHA_MNw09XhFfDQS8TtKvNJ7MSrw&s",
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator", "member"],
      default: "user",
    },
    passwordResetToken: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    passwordResetTokenExpire: {
      type: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    rank: {
      type: String,
      default: "",
    },
    trophies: [
      {
        name: String,
        count: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Users", authSchema);
