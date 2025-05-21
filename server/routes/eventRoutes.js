import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  deleteEvent,
  deleteMultipleEvents,
  fetchAllEvents,
  getAllEventforCatches,
  getSingleEventById,
  getUpcomingEvents,
  postEvent,
  updateEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// Create Event
router.post("/create/event", requireSignIn, postEvent);

// Update Event
router.put("/updateEvent/:id", requireSignIn, updateEvent);

// Fetch All Events
router.get("/allEvents", fetchAllEvents);

// Fetch Events by type
router.get("/upcommingEvents/:type", getUpcomingEvents);

// Fetch Single Event
router.get("/event/detail/:id", getSingleEventById);

// Get All Event for Catches
router.get("/allEventforCatches", getAllEventforCatches);

// Delete Event
router.delete("/deleteEvent/:id", requireSignIn, deleteEvent);

// Delete Multiple Events
router.put(
  "/deleteMultipleEvents",
  requireSignIn,
  isAdmin,
  deleteMultipleEvents
);

export default router;
