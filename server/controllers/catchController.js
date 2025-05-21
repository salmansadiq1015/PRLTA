import activityModel from "../models/activityModel.js";
import authModel from "../models/authModel.js";
import catchModel from "../models/catchModel.js";
import eventModel from "../models/eventModel.js";

// Create Catch
export const createCatch = async (req, res) => {
  try {
    const {
      name,
      email,
      vessel_Name,
      fisherman,
      images,
      location,
      vessel_Owned,
      shore,
      category,
      tournament_name,
      date,
      specie,
      line_strenght,
      fish_width,
      fish_length,
      status,
      featured,
      latitude,
      longitude,
    } = req.body;

    if (!name || !email) {
      return res.status(400).send({
        success: false,
        message: "Name & Email is required!",
      });
    }

    const user = await authModel.findOne({ email: email }).select("name");

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found with this email!",
      });
    }

    let score = 0;

    // Score Calculation
    if (shore.toLowerCase() === "inshore") {
      // Inshore: (Girth² × Length) ÷ 800 * line class multiplier
      const girth = parseFloat(fish_width);
      const length = parseFloat(fish_length);
      const lineMultiplier = parseFloat(line_strenght); // e.g., 20 lb = 2.0

      if (!isNaN(girth) && !isNaN(length) && !isNaN(lineMultiplier)) {
        const weight = (girth ** 2 * length) / 800;
        score = parseFloat((weight * lineMultiplier).toFixed(2));
      }
    } else {
      // Offshore: You can assign fixed values based on species and line strength
      // Example rule: Aguja Azul on 8 lb = 750 points
      if (specie === "Aguja Azul" && line_strenght === "8") {
        score = 750;
      } else {
        score = 700;
      }
    }
    //
    const catches = await catchModel.create({
      user: user._id,
      name,
      email,
      images,
      vessel_Name,
      location,
      fisherman,
      vessel_Owned,
      shore,
      category,
      tournament_name,
      date,
      specie,
      line_strenght,
      fish_width,
      fish_length,
      status,
      featured,
      score,
      latitude,
      longitude,
    });

    // Pushing cateh In Event
    const tournament = await eventModel.findOne({ title: tournament_name });

    if (tournament) {
      tournament.catches.push(catches._id);
      await tournament.save();
    }

    await activityModel.create({
      userId: user._id,
      activity: `User ${user.name} has added catches for "${vessel_Name}".`,
    });

    res.status(200).send({
      success: true,
      message: "Catch created successfully!",
      catches: catches,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while post catch, please try again!",
      error: error,
    });
  }
};

// Update Catch
export const updateCatch = async (req, res) => {
  try {
    const catchId = req.params.id;
    const {
      name,
      email,
      vessel_Name,
      images,
      location,
      fisherman,
      vessel_Owned,
      shore,
      category,
      tournament_name,
      date,
      specie,
      line_strenght,
      fish_width,
      fish_length,
      status,
      featured,
      score,
      rank,
      latitude,
      longitude,
    } = req.body;

    const existingCatch = await catchModel.findById(catchId);

    if (!existingCatch) {
      return res.status(404).send({
        success: false,
        message: "Catch not found!",
      });
    }
    const user = await authModel
      .findOne({ email: email || existingCatch.email })
      .select("name");

    const catches = await catchModel.findByIdAndUpdate(
      { _id: existingCatch._id },
      {
        user: user._id,
        name: name || existingCatch.name,
        email: email || existingCatch.email,
        vessel_Name: vessel_Name || existingCatch.vessel_Name,
        images: images || existingCatch.images,
        location: location || existingCatch.location,
        fisherman: fisherman || existingCatch.fisherman,
        vessel_Owned: vessel_Owned || existingCatch.vessel_Owned,
        shore: shore || existingCatch.shore,
        category: category || existingCatch.category,
        tournament_name: tournament_name || existingCatch.tournament_name,
        date: date || existingCatch.date,
        specie: specie || existingCatch.specie,
        line_strenght: line_strenght || existingCatch.line_strenght,
        fish_width: fish_width || existingCatch.fish_width,
        fish_length: fish_length || existingCatch.fish_length,
        status: status || existingCatch.status,
        featured: featured || existingCatch.featured,
        score: score || existingCatch.score,
        rank: rank || existingCatch.rank,
        latitude: latitude || existingCatch.latitude,
        longitude: longitude || existingCatch.longitude,
      },
      { new: true }
    );

    const tournament = await eventModel.findOne({
      title: catches.tournament_name,
    });

    if (tournament) {
      const existingCatch = tournament.catches.includes(catches._id);

      if (!existingCatch) {
        tournament.catches.push(catches._id);
        await tournament.save();
      }
    }

    await activityModel.create({
      userId: req.user.user._id,
      activity: `User ${req.user.user.name} has update catches "${catches.vessel_Name}".`,
    });

    res.status(200).send({
      success: true,
      message: "Catch updated successfully!",
      catches: catches,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while update catch, please try again!",
      error: error,
    });
  }
};

// Get All Catches
export const fetchCatches = async (req, res) => {
  try {
    const catches = await catchModel
      .find()
      .populate("user", "name email avatar points rank trophies");

    res.status(200).send({
      success: true,
      message: "All catches list!",
      catches: catches,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while fetch all catches, please try again!",
      error: error,
    });
  }
};

// Get Catches by User
export const userCatches = async (req, res) => {
  try {
    const userId = req.params.id;
    const catches = await catchModel.find({ user: userId });

    res.status(200).send({
      success: true,
      message: "Catches by user",
      catches: catches,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message:
        "Error occured while fetching catches by user, please try again!",
      error: error,
    });
  }
};

// Fetch Single Catches
export const fetchSingleCatch = async (req, res) => {
  try {
    const catchId = req.params.id;
    const catches = await catchModel
      .findById(catchId)
      .populate("user", "name email avatar points rank trophies");

    res.status(200).send({
      success: true,
      message: "Catch Detail!",
      catches: catches,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while fetch catch detail, please try again!",
      error: error,
    });
  }
};

// Fetch Catches name
export const fetchCatchesName = async (req, res) => {
  try {
    const catches = await catchModel
      .find({})
      .select("name email vessel_Name  fisherman");

    res.status(200).send({
      success: true,
      message: "Catches name list!",
      catches: catches,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while fetch catches name, please try again!",
      error: error,
    });
  }
};

// Delete Catch
export const deleteCatch = async (req, res) => {
  try {
    const catchId = req.params.id;

    const existingCatch = await catchModel.findById(catchId);

    if (!existingCatch) {
      return res.status(404).send({
        success: false,
        message: "Catch not found!",
      });
    }

    await catchModel.findByIdAndDelete(catchId);

    res.status(200).send({
      success: true,
      message: "Catch delete successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while delete catch, please try again!",
      error: error,
    });
  }
};

// Get Filter catches(daily , weekly , monthly, Total)

export const getFilterCatches = async (req, res) => {
  try {
    const filter = req.params.filter;
    let startDate;

    switch (filter) {
      case "daily":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case "weekly":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case "monthly":
        startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "total":
        startDate = new Date(0);
        break;
      default:
        return res.status(400).send({
          success: false,
          message: "Invalid filter type",
        });
    }
    const catches = await catchModel
      .find({
        createdAt: { $gte: startDate },
      })
      .populate("user", "name email avatar rank points")
      .sort({ "user.points": -1 });

    res.status(200).send({
      success: true,
      message: "Filter catches list!",
      data: catches,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while get filter catches, please try again!",
      error: error,
    });
  }
};

// Update Status/Featured
export const updateCatchStatus = async (req, res) => {
  try {
    const catchId = req.params.id;
    const { status, featured } = req.body;

    const existingCatch = await catchModel.findById(catchId);

    if (!existingCatch) {
      return res.status(404).send({
        success: false,
        message: "Catch not found!",
      });
    }

    const catches = await catchModel.findByIdAndUpdate(
      { _id: existingCatch._id },
      {
        status: status || existingCatch.status,
        featured: featured || existingCatch.featured,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Catch updated successfully!",
      catches: catches,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while update catch, please try again!",
      error: error,
    });
  }
};

// Delete All Catches
export const deleteAllCatches = async (req, res) => {
  try {
    const { catchIds } = req.body;

    if (!catchIds) {
      return res.status(400).send({
        success: false,
        message: "Catch Ids is required!",
      });
    }

    await catchModel.deleteMany({ _id: { $in: catchIds } });

    res.status(200).send({
      success: true,
      message: "All catches deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while delete all catches, please try again!",
      error: error,
    });
  }
};
