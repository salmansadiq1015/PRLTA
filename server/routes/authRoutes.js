import express from "express";
import {
  addUser,
  deleteAllUsers,
  deleteUser,
  editRole,
  getAdminUsers,
  getAllUsers,
  getSingleUser,
  importUsersFromExcel,
  loginUser,
  registerController,
  resetPassword,
  socialAuth,
  updatePassword,
  updateProfile,
  updateUserProfile,
  updateUserRole,
  uploadFiles,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";
import upload from "../middlewares/upload.js";
// import multer from "multer";

const router = express.Router();
// const upload = multer();

// Register
router.post("/register_user", registerController);

// Email Verification
// router.post("/email_verification", verificationUser);

// User Login
router.post("/login_user", loginUser);

// Social Auth
router.post("/social/auth", socialAuth);

// ALl Users
router.get("/all/users", getAllUsers);

// Get Single User Info
router.get("/user/info/:id", getSingleUser);

// Update User Profile
router.patch("/update/userProfile/:id", requireSignIn, updateProfile);

// Update User Profile - Admin
router.put("/update/:id", requireSignIn, isAdmin, updateUserProfile);

// Update Role
router.put("/update_role/:id", requireSignIn, isAdmin, editRole);

// Reset Password Token
router.post("/reset/password", resetPassword);

// Update Password
router.put("/update/password", updatePassword);

// Delete User
router.delete("/delete/users/:id", requireSignIn, isAdmin, deleteUser);

// Add User - Admin
router.post("/add/user", requireSignIn, isAdmin, addUser);

// Delete All Users
router.put("/delete/all/users", requireSignIn, isAdmin, deleteAllUsers);

// Update User Role
router.put("/update/role/:id", requireSignIn, isAdmin, updateUserRole);

// Get Admin Users
router.get("/admin/users", getAdminUsers);

// Upload Files
router.post("/upload/files", uploadMiddleware, uploadFiles);

// Import Users
router.post("/import/users", upload.single("file"), importUsersFromExcel);
export default router;
