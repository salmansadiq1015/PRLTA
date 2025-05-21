import tournamentModel from "../models/tournamentModel.js";

// Create tournament
export const createTournament = async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;
    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }

    const tournament = await tournamentModel.create({
      title,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Tournament added successfully",
      data: tournament,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Update tournament
export const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startDate, endDate } = req.body;

    const tournament = await tournamentModel.findById(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    const updateTournament = await tournamentModel.findByIdAndUpdate(
      id,
      {
        title,
        startDate,
        endDate,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Tournament updated successfully",
      data: updateTournament,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Get tournament
export const getTournamentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await tournamentModel.findById(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tournament fetched successfully",
      data: tournament,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Get all tournaments
export const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentModel.find({});

    res.status(200).json({
      success: true,
      message: "Tournaments list",
      data: tournaments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Delete tournament
export const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await tournamentModel.findByIdAndDelete(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tournament deleted successfully",
      data: tournament,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
