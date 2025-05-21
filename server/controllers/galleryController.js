import activityModel from "../models/activityModel.js";
import galleryModel from "../models/galleryModel.js";

// Post Gallery Image
export const postGalleryImage = async (req, res) => {
  try {
    const { title, image } = req.body;

    const userId = req.user.user._id;

    if (!title) {
      return res.status(400).send({
        success: false,
        message: "Title is required!",
      });
    }
    if (!image) {
      return res.status(400).send({
        success: false,
        message: "Image is required!",
      });
    }

    const gallery = new galleryModel({
      title,
      author: userId,
      image,
    });

    await gallery.save();

    res.status(200).send({
      success: true,
      message: "Image posted successfully!",
      gallery: gallery,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while post image. Please try again later.",
      error: error,
    });
  }
};

// Update Gallery Image
export const updateGalleryImage = async (req, res) => {
  try {
    const galleryId = req.params.id;
    const { title, image } = req.body;

    const isExisting = await galleryModel.findById(galleryId);

    if (!isExisting) {
      return res.status(404).send({
        success: false,
        message: "Gallery image not found!",
      });
    }

    const gallery = await galleryModel.findByIdAndUpdate(
      { _id: isExisting._id },
      {
        title: title || isExisting.title,
        image: image || isExisting.image,
      },
      { new: true }
    );

    await gallery.save();

    res.status(200).send({
      success: true,
      message: "Image updated successfully!",
      gallery: gallery,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while update image. Please try again later.",
      error: error,
    });
  }
};

// Get All Gallery
export const fetchAllGallery = async (req, res) => {
  try {
    const gallery = await galleryModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("author", "name email avatar");

    res.status(200).send({
      success: true,
      message: "All gallery list",
      gallery: gallery,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while get all gallery.",
      error: error,
    });
  }
};

// Fetch Single Image
export const fetchSingleImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await galleryModel
      .findById(imageId)
      .populate("author", "name email avatar");

    res.status(200).send({
      success: true,
      imagedetail: image,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while get image detail.",
      error: error,
    });
  }
};

// Delete Gallery Image
export const deleteGalleryImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    await galleryModel.findByIdAndDelete(imageId);

    res.status(200).send({
      success: true,
      message: "Gallery Image deleted success.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while delete gallery image.",
      error: error,
    });
  }
};

// Update View On every blog open
export const updateBlogView = async (req, res) => {
  try {
    const imageId = req.params.id;

    const image = await galleryModel
      .findByIdAndUpdate(imageId, { $inc: { views: 1 } }, { new: true })
      .select("-image");

    if (!image) {
      return res.status(404).send({
        success: false,
        message: "Image not found!",
      });
    }

    const user = req.user.user;

    if (user) {
      await activityModel.create({
        userId: user._id,
        activity: `User ${user.name} has view gallery image "${image.title}".`,
      });
    }

    res.status(200).send({
      success: true,
      message: "Image view updated successfully!",
      image: image,
    });
  } catch (error) {
    console.error("Error updating image views:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while updating image views.",
      error,
    });
  }
};
