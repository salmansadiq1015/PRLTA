import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createTournament,
  deleteTournament,
  getAllTournaments,
  getTournamentDetails,
  updateTournament,
} from "../controllers/tournamentController.js";

const router = express.Router();

// Add tournament
router.post("/add", requireSignIn, isAdmin, createTournament);

// Update tournament
router.put("/update/:id", requireSignIn, isAdmin, updateTournament);

// Get tournament
router.get("/details/:id", getTournamentDetails);

// Get all tournaments
router.get("/all", getAllTournaments);

// Delete tournament
router.delete("/delete/:id", requireSignIn, isAdmin, deleteTournament);

export default router;
