import fishingSpotModel from "../models/fishingSpotModel.js";
import cron from "node-cron";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// 📌 Add a new fishing spot
export const addSpot = async (req, res) => {
  try {
    const { name, latitude, longitude, description, location } = req.body;

    if (!name || !latitude || !longitude) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields!" });
    }

    // Fetch weather and tide data
    const weather = await getWeather(latitude, longitude);
    const tide = await getTide(latitude, longitude);

    const spot = new fishingSpotModel({
      name,
      latitude,
      longitude,
      description,
      location,
      weather,
      tide,
    });
    await spot.save();

    res
      .status(201)
      .json({ success: true, message: "Fishing spot added!", spot });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error adding spot", error });
  }
};

// 📌 Get all fishing spots
export const fetchAllSpot = async (req, res) => {
  try {
    const spots = await fishingSpotModel.find({});
    res.status(200).json({ success: true, spots: spots });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching spots", error });
  }
};

// 📌 Get a single fishing spot
export const fetchSingleSpot = async (req, res) => {
  try {
    const spotId = req.params.id;
    const spot = await fishingSpotModel.findById(spotId);
    res.status(200).json({ success: true, spot });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching spot", error });
  }
};

// 📌 Update a fishing spot
export const updateSpot = async (req, res) => {
  try {
    const spotId = req.params.id;
    const { name, latitude, longitude, description, location } = req.body;

    const existingSpot = await fishingSpotModel.findById(spotId);

    if (!existingSpot) {
      return res
        .status(404)
        .json({ success: false, message: "Fishing spot not found!" });
    }

    // Fetch weather and tide data again
    const weather = await getWeather(latitude, longitude);
    const tide = await getTide(latitude, longitude);

    const spot = await fishingSpotModel.findByIdAndUpdate(
      { _id: existingSpot._id },
      {
        name: name || existingSpot.name,
        latitude: latitude || existingSpot.latitude,
        longitude: longitude || existingSpot.longitude,
        description: description || existingSpot.description,
        location: location || existingSpot.location,
        weather: weather || existingSpot.weather,
        tide: tide || existingSpot.tide,
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Spot updated!", spot });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating spot", error });
  }
};

// 📌 Delete a fishing spot
export const deleteSpot = async (req, res) => {
  try {
    const spotId = req.params.id;

    const existingSpot = await fishingSpotModel.findById(spotId);

    if (!existingSpot) {
      return res
        .status(404)
        .json({ success: false, message: "Fishing spot not found!" });
    }

    await fishingSpotModel.findByIdAndDelete(spotId);

    res.status(200).json({ success: true, message: "Spot deleted!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting spot", error });
  }
};

const getWeather = async (latitude, longitude) => {
  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    console.log("apiKey:", apiKey);
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    );
    return response.data.weather[0].description;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};

const getTide = async (latitude, longitude) => {
  try {
    const apiKey = process.env.WORLD_TIDES_API_KEY;

    const response = await axios.get(
      `https://www.worldtides.info/api/v2?heights&lat=${latitude}&lon=${longitude}&key=${apiKey}`
    );

    return response.data.heights;
  } catch (error) {
    console.error(
      "Error fetching tide:",
      error.response?.data || error.message
    );
    return null;
  }
};

// const getTide = async (latitude, longitude) => {
//   try {
//     const apiKey = "YOUR_TIDE_API_KEY";

//     const station = `${latitude},${longitude}`;

//     const response = await axios.get(
//       `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_level&begin_date=20230218&end_date=20230218&datum=MLLW&time_zone=GMT&units=english&station=${station}&format=json&apiKey=${apiKey}`
//     );

//     return response.data.value;
//   } catch (error) {
//     console.error("Error fetching tide:", error);
//     return null;
//   }
// };

cron.schedule("0 1 * * *", async () => {
  const spots = await fishingSpotModel.find({});
  for (const spot of spots) {
    const weather = await getWeather(spot.latitude, spot.longitude);
    const tide = await getTide(spot.latitude, spot.longitude);

    await fishingSpotModel.findByIdAndUpdate(spot._id, {
      weather,
      tide,
    });
  }
});
