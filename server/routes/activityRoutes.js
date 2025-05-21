import express from "express";
import {
  deleteActivity,
  fetchAllActivity,
  fetchAllCount,
  fetctAnalytics,
} from "../controllers/activityController.js";

const router = express.Router();

// Fetch All Activity
router.get("/all", fetchAllActivity);

// Delete Activity
router.delete("/delete/:id", deleteActivity);

// All Counts
router.get("/all/counts", fetchAllCount);

// Activity Analytics
router.get("/analytics", fetctAnalytics);

export default router;
