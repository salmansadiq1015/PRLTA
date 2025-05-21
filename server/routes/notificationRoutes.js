import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  deleteAllNotifications,
  fetchAllNotifications,
  sendNotification,
  updateNotificationStatus,
} from "../controllers/notificationController.js";

const router = express.Router();

// Send Notification
router.post("/send", requireSignIn, isAdmin, sendNotification);

// Get All Notifications
router.get("/all/:id", fetchAllNotifications);

// Update Notification Status
router.put("/update/:id", requireSignIn, updateNotificationStatus);

// Delete All Notifications
router.put("/delete", requireSignIn, isAdmin, deleteAllNotifications);

export default router;
