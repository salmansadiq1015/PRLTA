import express from "express";
import {
  addSpot,
  deleteSpot,
  fetchAllSpot,
  fetchSingleSpot,
  updateSpot,
} from "../controllers/fishingSpotController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📌 Add a new fishing spot
router.post("/add", requireSignIn, isAdmin, addSpot);

// 📌 Get all fishing spots
router.get("/all", fetchAllSpot);

// 📌 Get a single fishing spot
router.get("/single/:id", fetchSingleSpot);

// 📌 Update a fishing spot
router.put("/update/:id", requireSignIn, isAdmin, updateSpot);

// 📌 Delete a fishing spot
router.delete("/delete/:id", requireSignIn, isAdmin, deleteSpot);

export default router;
