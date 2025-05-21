import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createCatch,
  deleteAllCatches,
  deleteCatch,
  fetchCatches,
  fetchCatchesName,
  fetchSingleCatch,
  getFilterCatches,
  updateCatch,
  updateCatchStatus,
  userCatches,
} from "../controllers/catchController.js";

const router = express.Router();

// Create Catch
router.post("/create/catch", requireSignIn, createCatch);

// Update Catch
router.put("/update/catch/:id", requireSignIn, updateCatch);

// Fetch Catches
router.get("/all/catch", fetchCatches);

// User Catch
router.get("/user/:id", userCatches);

// Catch Detail
router.get("/catch/detail/:id", fetchSingleCatch);

// Fetch Catches name
router.get("/name", fetchCatchesName);

// delete Catch
router.delete("/delete/catch/:id", requireSignIn, deleteCatch);

// Filter Catches
router.get("/filter/:filter", getFilterCatches);

// Update Status/Featured
router.put("/update/status/:id", requireSignIn, isAdmin, updateCatchStatus);

// Delete All Catches
router.put("/delete/all/catch", requireSignIn, isAdmin, deleteAllCatches);

export default router;
