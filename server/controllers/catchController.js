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
        message: "Name & Email are required!",
      });
    }

    const user = await authModel.findOne({ email }).select("name");
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found with this email!",
      });
    }

    // Line class multipliers (inshore)
    const lineMultipliers = {
      2: 10.7,
      4: 6.3,
      6: 5.2,
      8: 4.3,
      10: 3.9,
      12: 3.5,
      16: 2.9,
      20: 2.4,
      30: 1.9,
    };

    // Offshore fixed points table
    const offshorePoints = {
      "Aguja Azul (Blue Marlin)": {
        4: 1070,
        6: 910,
        8: 750,
        12: 610,
        16: 495,
        20: 410,
        30: 300,
      },
      "Aguja Blanca (White Marlin)": {
        4: 535,
        6: 450,
        8: 360,
        12: 290,
        16: 245,
        20: 205,
        30: 160,
      },
      "Stripe Marlin": {
        4: 535,
        6: 450,
        8: 360,
        12: 290,
        16: 245,
        20: 205,
        30: 160,
      },
      "Pez Vela": {
        4: 430,
        6: 360,
        8: 285,
        12: 235,
        16: 200,
        20: 165,
        30: 130,
      },
      Spearfish: { 4: 430, 6: 360, 8: 285, 12: 235, 16: 200, 20: 165, 30: 130 },
    };

    const inshoreSpecies = ["Tarpon", "Snook", "Jackfish", "Ladyfish"];
    const isInshore = shore?.toLowerCase() === "inshore";
    const isValidInshoreSpecies = inshoreSpecies.includes(specie);

    const girth = parseFloat(fish_width);
    const length = parseFloat(fish_length);
    const line = line_strenght.toString();

    let weight = 0;
    let score = 0;

    if (isInshore && isValidInshoreSpecies && !isNaN(girth) && !isNaN(length)) {
      // Inshore: Calculate weight and score
      weight = (girth ** 2 * length) / 800;
      const multiplier = lineMultipliers[line];
      if (multiplier) {
        score = parseFloat((weight * multiplier).toFixed(2));
      }
    } else {
      // Offshore: Use fixed score table
      const offshoreSpecie = Object.keys(offshorePoints).find(
        (s) => s.toLowerCase() === specie.toLowerCase()
      );
      if (offshoreSpecie && offshorePoints[offshoreSpecie][line]) {
        score = offshorePoints[offshoreSpecie][line];
      } else {
        score = 0; // Default fallback
      }
    }

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
      weight,
      latitude,
      longitude,
    });

    const tournament = await eventModel.findOne({ title: tournament_name });
    if (tournament) {
      tournament.catches.push(catches._id);
      await tournament.save();
    }

    await activityModel.create({
      userId: user._id,
      activity: `User ${user.name} has added a catch for vessel "${vessel_Name}".`,
    });

    return res.status(200).send({
      success: true,
      message: "Catch created successfully!",
      catches,
    });
  } catch (error) {
    console.error("Catch creation error:", error);
    return res.status(500).send({
      success: false,
      message: "Error occurred while posting catch.",
      error,
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

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found with this email!",
      });
    }

    // Inshore logic
    const inshoreSpecies = ["Tarpon", "Snook", "Jackfish", "Ladyfish"];
    const lineMultipliers = {
      2: 10.7,
      4: 6.3,
      6: 5.2,
      8: 4.3,
      10: 3.9,
      12: 3.5,
      16: 2.9,
      20: 2.4,
      30: 1.9,
    };

    // Offshore logic
    const offshorePoints = {
      "Aguja Azul (Blue Marlin)": {
        4: 1070,
        6: 910,
        8: 750,
        12: 610,
        16: 495,
        20: 410,
        30: 300,
      },
      "Aguja Blanca (White Marlin)": {
        4: 535,
        6: 450,
        8: 360,
        12: 290,
        16: 245,
        20: 205,
        30: 160,
      },
      "Stripe Marlin": {
        4: 535,
        6: 450,
        8: 360,
        12: 290,
        16: 245,
        20: 205,
        30: 160,
      },
      "Pez Vela": {
        4: 430,
        6: 360,
        8: 285,
        12: 235,
        16: 200,
        20: 165,
        30: 130,
      },
      Spearfish: { 4: 430, 6: 360, 8: 285, 12: 235, 16: 200, 20: 165, 30: 130 },
    };

    // Determine shore/specie context
    const isInshore =
      (shore || existingCatch.shore)?.toLowerCase() === "inshore";
    const speciesName = specie || existingCatch.specie;
    const isValidInshoreSpecies = inshoreSpecies.includes(speciesName);
    const girth = parseFloat(fish_width || existingCatch.fish_width);
    const length = parseFloat(fish_length || existingCatch.fish_length);
    const line = (line_strenght || existingCatch.line_strenght)?.toString();

    let weight = 0;
    let score = 0;

    if (isInshore && isValidInshoreSpecies && !isNaN(girth) && !isNaN(length)) {
      weight = (girth ** 2 * length) / 800;
      const multiplier = lineMultipliers[line];
      if (multiplier) {
        score = parseFloat((weight * multiplier).toFixed(2));
      }
    } else {
      const offshoreSpecie = Object.keys(offshorePoints).find(
        (s) => s.toLowerCase() === speciesName.toLowerCase()
      );
      if (offshoreSpecie && offshorePoints[offshoreSpecie][line]) {
        score = offshorePoints[offshoreSpecie][line];
      } else {
        score = 0; // fallback
      }
    }

    const updatedCatch = await catchModel.findByIdAndUpdate(
      catchId,
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
        featured: featured ?? existingCatch.featured,
        score,
        rank: rank || existingCatch.rank,
        latitude: latitude || existingCatch.latitude,
        longitude: longitude || existingCatch.longitude,
        weight,
      },
      { new: true }
    );

    // Sync tournament
    const tournament = await eventModel.findOne({
      title: updatedCatch.tournament_name,
    });

    if (tournament && !tournament.catches.includes(updatedCatch._id)) {
      tournament.catches.push(updatedCatch._id);
      await tournament.save();
    }

    // Log activity
    await activityModel.create({
      userId: req.user.user._id,
      activity: `User ${req.user.user.name} has updated catch for "${updatedCatch.vessel_Name}".`,
    });

    return res.status(200).send({
      success: true,
      message: "Catch updated successfully!",
      catches: updatedCatch,
    });
  } catch (error) {
    console.error("Update catch error:", error);
    return res.status(500).send({
      success: false,
      message: "Error occurred while updating catch.",
      error,
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
