import activityModel from "../models/activityModel.js";
import blogModel from "../models/blogModel.js";
import fs from "fs";

// Post Blog
export const createBlog = async (req, res) => {
  try {
    const { title, description, banner } = req.body;

    const userId = req.user.user._id;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, description, are required fields!",
      });
    }

    console.log("Banner:", banner, title, description, banner, userId);

    const existingBlog = await blogModel.findOne({ title });
    if (existingBlog) {
      return res
        .status(201)
        .send({ message: "Blog of this name is already exist!" });
    }

    const blog = new blogModel({
      title,
      description,
      author: userId,
      banner,
    });

    await blog.save();

    res.status(200).send({
      success: true,
      message: "Blog created successfully!",
      blog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message:
        "An error occurred while creating the blog. Please try again later.",
      error: error,
    });
  }
};

// Update Blog
export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, description, banner } = req.body;

    const userId = req.user.user._id;

    const existingBlog = await blogModel.findById(blogId);

    if (!existingBlog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found!",
      });
    }

    const blog = await blogModel.findByIdAndUpdate(
      { _id: existingBlog._id },
      {
        title: title || existingBlog.title,
        description: description || existingBlog.title,
        author: userId,
        banner: banner || existingBlog.banner,
      },
      { new: true }
    );

    await blog.save();

    res.status(200).send({
      success: true,
      message: "Blog updated successfully!",
      blog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message:
        "An error occurred while update the blog. Please try again later.",
      error: error,
    });
  }
};

// Banner-Image-Controller
export const bannerImageController = async (req, res) => {
  try {
    const type = req.params.type;

    if (type === "banner") {
      const blog = await blogModel.findById(req.params.id).select("banner");

      if (blog.banner.data) {
        res.set("Content-type", blog.banner.contentType);
        res.status(200).send(blog.banner.data);
      }
    } else {
      const blog = await blogModel
        .findById(req.params.id)
        .populate("author", "name email avatar");

      if (blog.banner.author.avatar.data) {
        res.set("Content-type", blog.banner.author.avatar.contentType);
        res.status(200).send(blog.banner.author.avatar.data);
      } else {
        res.status(200).send({ message: "User avatar not found!" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error while getting auth image!",
      error,
    });
  }
};

// Get All Blogs
export const fetchAllBlog = async (req, res) => {
  try {
    const blogs = await blogModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("author", "name email avatar");

    res.status(200).send({
      success: true,
      message: "All blog list",
      blogs: blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while get all blog.",
      error: error,
    });
  }
};

// Fetch Single Blog
export const fetchSingleBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await blogModel
      .findById(blogId)
      .populate("author", "name email avatar");

    res.status(200).send({
      success: true,
      blog: blog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while get blog detail.",
      error: error,
    });
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    await blogModel.findByIdAndDelete(blogId);

    res.status(200).send({
      success: true,
      message: "Blog deleted success.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while delete blog.",
      error: error,
    });
  }
};

// Update View On every blog open
export const updateBlogView = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await blogModel
      .findByIdAndUpdate(blogId, { $inc: { views: 1 } }, { new: true })
      .select("-banner");

    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found!",
      });
    }

    const user = req.user.user;
    if (user) {
      await activityModel.create({
        userId: user._id,
        activity: `User ${user.name} has viewed blog "${blog.title}".`,
      });
    }

    res.status(200).send({
      success: true,
      message: "Blog view updated successfully!",
      blog,
    });
  } catch (error) {
    console.error("Error updating blog views:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while updating blog views.",
      error,
    });
  }
};
