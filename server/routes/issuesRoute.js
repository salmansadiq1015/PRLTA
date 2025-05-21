import express from "express";
import {
  createIssue,
  deleteIssue,
  fetchAllIssues,
  fetchUserIssues,
  updateIssue,
} from "../controllers/issuesController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Issue
router.post("/create", requireSignIn, createIssue);

// Update Issue
router.put("/update/:id", requireSignIn, updateIssue);

// Fetch All Issues
router.get("/fetchAll", fetchAllIssues);

// Fetch User Issues
router.get("/fetchUser/:id", fetchUserIssues);

// Delete Issue
router.delete("/delete/:id", requireSignIn, deleteIssue);

export default router;
