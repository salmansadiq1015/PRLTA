import express from "express";
import formidable from "express-formidable";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  deleteGalleryImage,
  fetchAllGallery,
  fetchSingleImage,
  postGalleryImage,
  updateBlogView,
  updateGalleryImage,
} from "../controllers/galleryController.js";

const router = express.Router();

// Post Blog
router.post("/postGalleryImage", requireSignIn, postGalleryImage);

// Update Blog
router.put("/update/gallery/:id", requireSignIn, updateGalleryImage);

// Get All Blogs
router.get("/allGallery", fetchAllGallery);

// Get Single Blog
router.get("/image/detail/:id", fetchSingleImage);

// Delete Blog
router.delete("/delete/gallery/image/:id", requireSignIn, deleteGalleryImage);

// Update Views
router.put("/updateViews/:id", requireSignIn, updateBlogView);

export default router;
