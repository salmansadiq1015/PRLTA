import mongoose from "mongoose";

const FishingSpotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    description: { type: String },
    location: { type: String, required: true },
    weather: {
      type: String,
    },
    tide: [Object],
  },
  { timestamps: true }
);

export default mongoose.model("FishingSpot", FishingSpotSchema);
