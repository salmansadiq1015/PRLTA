import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    isUpcoming: {
      type: Boolean,
      default: false,
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },

    resultsPosted: { type: Boolean, default: false },
    resultPostedDate: {
      type: Date,
      default: null,
    },
    notificationsSent: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    catches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "catches",
      },
    ],
    winners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "catches",
      },
    ],
  },
  { timestamps: true }
);

// 🛠 Middleware to automatically set `isUpcoming`
eventSchema.pre("save", function (next) {
  this.isUpcoming = new Date(this.startDate) > new Date();
  next();
});

eventSchema.pre("findOneAndUpdate", function (next) {
  if (this._update.startDate) {
    this._update.isUpcoming = new Date(this._update.startDate) > new Date();
  }
  next();
});

// 🏁 Auto-update Rankings & Declare Winner
// eventSchema.methods.updateRankings = function () {
//   this.participants.sort((a, b) => b.score - a.score);
//   this.participants.forEach((participant, index) => {
//     participant.rank = index + 1;
//   });

//   if (this.participants.length > 0) {
//     this.winner = this.participants[0].userId;
//     this.resultsPosted = true;
//     this.notificationsSent = true;
//   }
// };

export default mongoose.model("Event", eventSchema);
