import activityModel from "../models/activityModel.js";
import authModel from "../models/authModel.js";
import blogModel from "../models/blogModel.js";
import catchModel from "../models/catchModel.js";
import eventModel from "../models/eventModel.js";
import galleryModel from "../models/galleryModel.js";
import { generateLast12MonthData } from "../utils/analyticsGenerator.js";

export const fetchAllActivity = async (req, res) => {
  try {
    const { date } = req.query;
    let activity;
    if (date) {
      activity = await activityModel
        .find({ createdAt: { $gte: date } })
        .populate("userId", "name email avatar");
    } else {
      activity = await activityModel
        .find({})
        .populate("userId", "name email avatar");
    }

    res.status(200).json({
      success: true,
      message: "All Activities",
      activities: activity,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Activity
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Activity id is required" });
    }

    await activityModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Activity deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ALl Count Dashboard
export const fetchAllCount = async (req, res) => {
  try {
    const users = await authModel.countDocuments({});
    const blogs = await blogModel.countDocuments({});
    const catches = await catchModel.countDocuments({});
    const gallery = await galleryModel.countDocuments({});
    const events = await eventModel.countDocuments({});

    res.status(200).send({
      success: true,
      count: {
        user: users,
        blog: blogs,
        catch: catches,
        gallery: gallery,
        event: events,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User Analytics
export const fetctAnalytics = async (req, res) => {
  try {
    const users = await generateLast12MonthData(authModel);
    const catches = await generateLast12MonthData(catchModel);
    const events = await generateLast12MonthData(eventModel);

    res.status(200).json({
      success: true,
      message: "Analytics",
      analytics: {
        users,
        catches,
        events,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error });
  }
};
