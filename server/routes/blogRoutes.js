import express from "express";
import formidable from "express-formidable";

import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  bannerImageController,
  createBlog,
  deleteBlog,
  fetchAllBlog,
  fetchSingleBlog,
  updateBlog,
  updateBlogView,
} from "../controllers/blogControllers.js";

const router = express.Router();

// Post Blog
router.post("/postBlog", requireSignIn, createBlog);

// Update Blog
router.put("/updateBlog/:id", requireSignIn, updateBlog);

// Get Banner Image
router.get("/getBannerImage/:id/:type", bannerImageController);

// Get All Blogs
router.get("/getAllBlogs", fetchAllBlog);

// Get Single Blog
router.get("/blog/detail/:id", fetchSingleBlog);

// Delete Blog
router.delete("/deleteBlog/:id", requireSignIn, deleteBlog);

// Update Views
router.put("/updateViews/:id", requireSignIn, updateBlogView);

export default router;
