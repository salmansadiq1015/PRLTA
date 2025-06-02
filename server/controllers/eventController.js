import mongoose from "mongoose";
import authModel from "../models/authModel.js";
import eventModel from "../models/eventModel.js";
import fs from "fs";
import cron from "node-cron";
import notificationModel from "../models/notificationModel.js";

// Add Event
export const postEvent = async (req, res) => {
  try {
    let {
      title,
      description,
      image,
      isUpcoming,
      startDate,
      endDate,
      resultsPosted,
      resultPostedDate,
    } = req.body;

    console.log(req.body);

    if (!title || !image) {
      return res.status(400).send({
        success: false,
        message: "Event title and image are required!",
      });
    }

    // if (typeof participants === "string") {
    //   try {
    //     participants = JSON.parse(participants);
    //   } catch (error) {
    //     console.log(error);
    //     return res.status(400).json({ error: "Invalid participants format" });
    //   }
    // }

    // const users = await authModel.find({ _id: { $in: participants } });

    // if (users.length !== participants.length) {
    //   return res.status(400).json({
    //     error: "Invalid participants format",
    //   });
    // }

    // const formattedParticipants = users.map((user) => ({
    //   userId: user._id,
    //   score: user.points || 0,
    //   rank: user.rank || null,
    // }));

    const event = new eventModel({
      title: title.trim(),
      description: description?.trim(),
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      isUpcoming:
        isUpcoming !== undefined
          ? isUpcoming
          : new Date(startDate) > new Date(),
      resultsPosted: resultsPosted ? true : false,
      image: image,
      resultPostedDate: resultPostedDate,
    });

    await event.save();

    res.status(200).send({
      success: true,
      message: "Event created successfully!",
      event: event,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in post event!",
      error,
    });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    let {
      title,
      description,
      isUpcoming,
      startDate,
      endDate,
      status,
      winners,
      resultsPosted,
      image,
      resultPostedDate,
    } = req.body;

    const existingEvent = await eventModel.findById(eventId);

    if (!existingEvent) {
      return res.status(404).send({
        success: false,
        message: "Event not found!",
      });
    }

    const event = await eventModel.findByIdAndUpdate(
      { _id: existingEvent._id },
      {
        title: title.trim() || existingEvent.title,
        description: description?.trim() || existingEvent.title,
        startDate: startDate ? new Date(startDate) : existingEvent.startDate,
        endDate: endDate ? new Date(endDate) : existingEvent.endDate,
        isUpcoming:
          isUpcoming !== undefined
            ? isUpcoming
            : date
            ? new Date(date) > new Date()
            : existingEvent.isUpcoming,
        status: status || existingEvent.status,
        winners: winners || existingEvent.winners,
        resultsPosted: resultsPosted || existingEvent.resultsPosted,
        resultPostedDate: resultPostedDate,
        image: image || existingEvent.image,
      },
      { new: true }
    );

    await event.save();

    res.status(200).send({
      success: true,
      message: "Event update successfully!",
      event: event,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update event!",
      error,
    });
  }
};

// Fetch All Events - Admin
export const fetchAllEvents = async (req, res) => {
  try {
    const events = await eventModel
      .find({})
      .sort({ startDate: 1 })
      .populate("winners", "name email score rank vessel_Name images")
      .populate({
        path: "catches",
        select: "name email vessel_Name score rank user",
        populate: {
          path: "user",
          select: "name email avatar rank points",
        },
      });

    res.status(200).send({
      success: true,
      message: "All Events list!",
      events: events,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetch all events!",
      error,
    });
  }
};

// Controller to Get Upcoming Events
export const getUpcomingEvents = async (req, res) => {
  try {
    const type = req.params.type;
    const upcomingEvents = await eventModel
      .find({ status: type })
      .sort({ startDate: 1 })
      .populate({
        path: "catches",
        select:
          "name email vessel_Name score rank user category specie line_strenght weight shore ",
        populate: {
          path: "user",
          select: "name email avatar ",
        },
      })
      .populate("winners", "name email score rank vessel_Name ");

    res.status(200).send({
      success: true,
      message: "Upcoming Event!",
      upcomingEvents: upcomingEvents,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching upcoming events",
      error: error.message,
    });
  }
};

// Get Event Detail
export const getSingleEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await eventModel
      .findById(eventId)
      .populate({
        path: "catches",
        select: "name email vessel_Name score rank user",
        populate: {
          path: "user",
          select: "name email avatar rank points",
        },
      })
      .populate("winners", "name email score rank vessel_Name images");

    if (!event) {
      return res.status(404).json({ message: "Event not found!" });
    }

    res.status(200).send({
      success: true,
      message: "Event detail.",
      event: event,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching event", error: error.message });
  }
};

// Delete an Event
export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const isExist = await eventModel.findById(eventId);

    if (!isExist) {
      return res.status(404).send({
        success: false,
        message: "Event not found!",
      });
    }
    await eventModel.findByIdAndDelete(eventId);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
};

// Delete Multiple Events
export const deleteMultipleEvents = async (req, res) => {
  try {
    const { ids } = req.body;
    const events = await eventModel.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      success: true,
      message: "Events deleted successfully",
      events,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting events", error: error.message });
  }
};

// Update Status Aut
const updateEventStatus = async () => {
  try {
    const currentDate = new Date();

    // Fetch all events
    const events = await eventModel.find({});

    for (const event of events) {
      let newStatus = event.status;

      if (currentDate < event.startDate) {
        newStatus = "upcoming";
      } else if (
        currentDate >= event.startDate &&
        currentDate <= event.endDate
      ) {
        newStatus = "ongoing";
      } else if (currentDate > event.endDate) {
        newStatus = "completed";
      }

      // Update only if status has changed
      if (event.status !== newStatus) {
        await eventModel.findByIdAndUpdate(event._id, { status: newStatus });

        if (newStatus === "ongoing") {
          await sendNotificationToAllUsers(event);
        }
      }
    }

    console.log("Event statuses updated successfully!");
  } catch (error) {
    console.error("Error updating event statuses:", error);
  }
};

// Function to send notifications to all users for ongoing events
const sendNotificationToAllUsers = async (event) => {
  try {
    const users = await authModel.find().select("name");

    if (users.length === 0) return;

    const notifications = users.map((user) => ({
      userId: user._id,
      message: `🚀 Exciting News! 🎉 The wait is over! The "${event.title}" has officially begun! 🏆🎣 
  🔥 Join now and make unforgettable memories! Don’t miss out!`,
    }));

    await notificationModel.insertMany(notifications);
    console.log(`Notifications sent for ongoing event: ${event.title}`);
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

// Function to update event status and send winner notifications
const updateEventResults = async () => {
  try {
    const events = await eventModel
      .find({
        status: { $ne: "completed" },
        endDate: { $lt: new Date() },
      })
      .populate("winner", "name email");

    for (const event of events) {
      event.updateRankings();
      event.status = "completed";
      await event.save();

      // Send notification to all users
      if (event.notificationsSent) {
        const users = await userModel.find({}, "_id");
        const notifications = users.map((user) => ({
          userId: user._id,
          message: `🏆 Congratulations! The event "${event.title}" has ended. 
          The winner is 🎉 "${event.winner.name}"! Stay tuned for more exciting competitions! 🚀`,
        }));

        await notificationModel.insertMany(notifications);
      }
    }
  } catch (error) {
    console.error("❌ Error updating event status:", error);
  }
};

// Schedule the function to run daily at 1 AM
cron.schedule("0 1 * * *", () => {
  console.log("Running event status update job...");
  updateEventStatus();
  updateEventResults();
});

// Get all Events just name, startDate, endDate
export const getAllEventforCatches = async (req, res) => {
  try {
    const events = await eventModel
      .find({
        isClosed: false,
      })
      .select("title startDate endDate");

    res.status(200).send({
      success: true,
      message: "All Events list!",
      events: events,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetch all events!",
      error,
    });
  }
};

// cron.schedule("*/2 * * * *", () => {
//   console.log("🔄 Running scheduled event update every 2 minutes...");
//   updateEventStatus();
//   updateEventResults();
// });
