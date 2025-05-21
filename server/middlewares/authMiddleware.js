import JWT from "jsonwebtoken";
import authModel from "../models/authModel.js";

// Chack Auth User
export const requireSignIn = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "JWT Token must be provided!",
    });
  }

  try {
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log("JWT Error:", error);
    return res.status(401).send({
      success: false,
      message: "Invalid JWT Token",
    });
  }
};

// Admin Role Middleware
export const isAdmin = async (req, res, next) => {
  if (!req.user.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access! User not authenticated.",
    });
  }
  try {
    const user = await authModel.findById(req.user.user._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access! User not found.",
      });
    }

    if (user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Forbidden! User does not have admin privileges.!",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Invalid JWT Token",
    });
  }
};
