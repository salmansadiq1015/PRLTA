import jwt from "jsonwebtoken";
import authModel from "../models/authModel.js";
import {
  comparePassword,
  createRandomToken,
  hashPassword,
} from "../helper/encryption.js";
import dotenv from "dotenv";
import fs from "fs";
import sendMail from "../helper/mail.js";
import activityModel from "../models/activityModel.js";
import XLSX from "xlsx";
import bcrypt from "bcrypt";
dotenv.config();

// Register User
export const registerController = async (req, res) => {
  try {
    const { name, email, password, avatar, phone } = req.body;

    // Validation
    if (!email) {
      return res.status(201).send({
        success: false,
        message: "Email is required!",
      });
    }
    if (!password) {
      return res.status(201).send({
        success: false,
        message: "Password is required!",
      });
    }

    // Check existing user
    const existingUser = await authModel.findOne({ email });
    if (existingUser) {
      return res.status(201).send({
        success: false,
        message: "User already exists!",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);

    // Save User
    const user = await authModel({
      email,
      password: hashedPassword,
      avatar: avatar,
      name,
      phone,
    });

    await user.save();

    res.status(200).send({
      success: true,
      message: `Register successfully!`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in register controller!",
      error,
    });
  }
};

//
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!email) {
//       return res.status(400).send({
//         success: false,
//         message: "Email is required!",
//       });
//     }
//     if (!password) {
//       return res.status(400).send({
//         success: false,
//         message: "Password is required!",
//       });
//     }

//     //
//     const isExisting = await authModel.findOne({ email: email });

//     if (isExisting) {
//       return res.status(400).send({
//         success: false,
//         message: "Email already exist!",
//       });
//     }

//     const user = { name, email, password };

//     const activationToken = await createActivationToken(user);
//     const activationCode = activationToken.activationCode;

//     // Send Email to User
//     const data = {
//       user: { name: user.name },
//       activationCode,
//       activationLink: "http://localhost:3000/verivication",
//     };

//     await sendMail({
//       email: user.email,
//       subject: "Varification Email!",
//       template: "activation_code.ejs",
//       data,
//     });

//     res.status(200).send({
//       success: true,
//       message: `Please cheak your email: ${user.email} to activate your account`,
//       activationToken: activationToken.token,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error register user!",
//       error: error,
//     });
//   }
// };

// Create Activation Token
// export const createActivationToken = async (user) => {
//   const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
//   const token = jwt.sign({ user, activationCode }, process.env.JWT_SECRET, {
//     expiresIn: "5m",
//   });

//   return { token, activationCode };
// };

// Save User
// export const verificationUser = async (req, res) => {
//   try {
//     const { activation_token, activation_code } = req.body;

//     if (!activation_token) {
//       return res.status(400).send({
//         success: false,
//         message: "Activation_token is required! ",
//       });
//     }
//     if (!activation_code) {
//       return res.status(400).send({
//         success: false,
//         message: "Activation_code is required! ",
//       });
//     }

//     const newUser = await jwt.verify(activation_token, process.env.JWT_SECRET);
//     if (newUser.activationCode !== activation_code) {
//       return res.status({
//         success: false,
//         message: "Invalid activation code!",
//       });
//     }
//     const { name, email, password } = newUser.user;

//     // Existing User

//     const isExisting = await authModel.findOne({ email });

//     if (isExisting) {
//       return res.status(400).send({
//         success: false,
//         message: "Email already exist!",
//       });
//     }

//     const hashedPassword = await hashPassword(password);

//     const user = await authModel.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(200).send({
//       success: true,
//       message: "Register successfully!",
//       user: {
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error while register user after activation!",
//     });
//   }
// };

// Login User Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email & Password in required!",
      });
    }

    const user = await authModel.findOne({ email: email });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid email & password!",
      });
    }

    if (user.isActive === false) {
      return res.status(400).send({
        success: false,
        message: "Your account was not approved. Please contact PRLTA.",
      });
    }

    const isPassword = await comparePassword(password, user.password);
    if (!isPassword) {
      return res.status(400).send({
        success: false,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign(
      { id: user._id, user: { _id: user._id, name: user.name } },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "29d" : "1d" }
    );

    const { password: userPassword, ...userData } = user._doc;

    // activity
    await activityModel.create({
      userId: user._id,
      activity: `User ${user.name} has logged in.`,
    });

    res.status(200).send({
      success: true,
      message: "Login successfully!",
      user: userData,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while login user!",
      error,
    });
  }
};

// Social Auth
export const socialAuth = async (req, res) => {
  try {
    const { email, name, avatar } = req.body;

    let user = await authModel.findOne({ email });

    if (!user) {
      const newUser = await authModel.create({
        email,
        name,
        avatar,
      });
      user = newUser;
    }

    const token = jwt.sign(
      { id: user._id, user: user },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password, ...userData } = user._doc;

    await activityModel.create({
      userId: user._id,
      activity: `User ${user.name} has logged in with Google.`,
    });

    res.status(200).send({
      success: true,
      message: "Login successfully!",
      user: userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error social auth!",
      error,
    });
  }
};

// Get All User
export const getAllUsers = async (req, res) => {
  try {
    const users = await authModel
      .find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all user controller!",
      error: error,
    });
  }
};

// Get Single User
export const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await authModel.find({ _id: userId }).select("-password");

    res.status(200).send({
      success: true,
      message: "User Info",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get single user controller!",
      error: error,
    });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Update User Id:", userId);
    const { name, userName, address, vessel_Name, avatar, phone, isActive } =
      req.body;

    // Existing User
    const user = await authModel.findById(userId);
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found!",
      });
    }

    const updateData = {
      name: name || user.name,
      userName: userName || user.userName,
      address: address || user.address,
      vessel_Name: vessel_Name || user.vessel_Name,
      avatar: avatar || user.avatar,
      phone: phone || user.phone,
      isActive: isActive || user.isActive,
    };

    const updatedUser = await authModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("-password");

    await activityModel.create({
      userId: user._id,
      activity: `User ${user.name} has updated their profile.`,
    });

    res.status(200).send({
      success: true,
      message: "Profile updated successfully!",
      updatedUser: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error update user!",
      error: error,
    });
  }
};

// Update Profile - Admin
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      name,
      userName,
      address,
      points,
      rank,
      role,
      status,
      phone,
      vessel_Name,
      isActive,
    } = req.body;

    // Existing User
    const user = await authModel.findById(userId);
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found!",
      });
    }

    const updateData = {
      name: name || user.name,
      userName: userName || user.userName,
      address: address || user.address,
      points: points || user.points,
      rank: rank || user.rank,
      role: role || user.role,
      isActive: status || user.status,
      phone: phone || user.phone,
      vessel_Name: vessel_Name || user.vessel_Name,
      isActive: isActive || user.isActive,
    };

    const updatedUser = await authModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("-password");

    res.status(200).send({
      success: true,
      message: "Profile updated successfully!",
      updatedUser: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error update user!",
      error: error,
    });
  }
};

// Update Role
export const editRole = async (req, res) => {
  try {
    const id = req.params.id;
    const { role } = req.body;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "User Id is required!",
      });
    }
    if (!role) {
      return res.status(400).send({
        success: false,
        message: "role is required!",
      });
    }

    const user = await authModel.findByIdAndUpdate(id, { role }, { new: true });
    await user.save();

    res.status(200).send({
      success: true,
      message: "Role updated!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error register user!",
      error: error,
    });
  }
};

// Send Reset Password Token
export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required!",
      });
    }

    const user = await authModel
      .findOne({ email: email })
      .select("_id name email passwordResetToken passwordResetTokenExpire");

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invaild email!",
      });
    }

    // Generate a random token
    const token = await createRandomToken();
    const expireIn = Date.now() + 10 * 60 * 1000;
    await authModel.findByIdAndUpdate(user._id, {
      passwordResetToken: token,
      passwordResetTokenExpire: expireIn,
    });

    // Send email to user
    const data = {
      user: { name: user.name, token: token },
    };

    await sendMail({
      email: user.email,
      subject: "Reset Password",
      template: "reset-password.ejs",
      data,
    });

    res.status(200).send({
      success: true,
      message: "Reset password link send to your email!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in reset password!",
      error: error,
    });
  }
};

// Update Password
export const updatePassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(201).send({
        success: false,
        message: "Reset token is required!",
      });
    }
    if (!newPassword) {
      return res.status(201).send({
        success: false,
        message: "New password is required!",
      });
    }

    // Check User
    const user = await authModel.findOne({
      passwordResetToken: token,
      passwordResetTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(201).send({
        success: false,
        message: "Token is invalid or has expired!",
      });
    }

    // Hashed Password
    const hashedPassword = await hashPassword(newPassword);

    const updatePassword = await authModel.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        passwordResetToken: "",
        passwordResetTokenExpire: "",
      },
      { new: true }
    );

    await updatePassword.save();

    await activityModel.create({
      userId: user._id,
      activity: `${user.name} has updated their password.`,
    });

    res.status(200).send({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update password!",
      error: error,
    });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await authModel.findById({ _id: userId });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found!",
      });
    }

    await authModel.findByIdAndDelete({ _id: user._id });

    res.status(200).send({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete user controller!",
      error: error,
    });
  }
};

// Add User - Admin
export const addUser = async (req, res) => {
  try {
    const {
      name,
      email,
      userName,
      password,
      role,
      address,
      points,
      rank,
      avatar,
    } = req.body;

    // Validation
    if (!email) {
      return res.status(201).send({
        success: false,
        message: "Email is required!",
      });
    }
    if (!password) {
      return res.status(201).send({
        success: false,
        message: "Password is required!",
      });
    }

    // Check existing user
    const existingUser = await authModel.findOne({ email });
    if (existingUser) {
      return res.status(201).send({
        success: false,
        message: "User already exists!",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);

    // Save User
    const user = await authModel({
      name,
      email,
      password: hashedPassword,
      userName,
      role,
      address,
      points,
      rank,
      avatar,
    });

    await user.save();

    res.status(200).send({
      success: true,
      message: `Register successfully!`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in register controller!",
      error,
    });
  }
};

// Delete All Users
export const deleteAllUsers = async (req, res) => {
  try {
    const userIds = req.body;
    const users = await authModel.find({ _id: { $in: userIds } });

    if (!users) {
      return res.status(201).send({
        success: false,
        message: "User not found!",
      });
    }

    await authModel.deleteMany({ _id: { $in: userIds } });

    res.status(200).send({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in delete all users controller!",
      error,
    });
  }
};

// Update Role & Status
export const updateUserRole = async (req, res) => {
  try {
    const id = req.params.id;
    const { role, isActive } = req.body;
    const existingUser = await authModel.findById(id);

    if (!existingUser) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    const user = await authModel.findByIdAndUpdate(
      id,
      {
        role: role || existingUser.role,
        isActive: isActive || existingUser.isActive,
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in update user role controller!",
      error,
    });
  }
};

// Get Admin Users
export const getAdminUsers = async (req, res) => {
  try {
    const users = await authModel.find({}).select("name email");
    res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in get admin users controller!",
      error,
    });
  }
};

// Upload Files
export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files were uploaded.",
      });
    }
    const fileUrls = req.files.map((file) => file.location);

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully!",
      fileUrls,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in upload files controller!",
      error,
    });
  }
};

// Add User  through CSV
export const importUsersFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required." });
    }

    const filePath = req.file.path;

    // Read the uploaded Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Create hashed password once
    const hashedPassword = await bcrypt.hash("000000", 10);

    // Prepare users from Excel data
    const users = sheetData.map((row) => ({
      name: `${row.firstName} ${row.lastName}`.trim(),
      email: row.email?.toLowerCase(),
      phone: row.phone,
      password: hashedPassword,
    }));

    // Filter out existing users
    const emails = [...new Set(users.map((u) => u.email))];
    const existingUsers = await authModel
      .find({ email: { $in: emails } })
      .select("email");
    const existingEmails = existingUsers.map((u) => u.email);
    const newUsers = users.filter((u) => !existingEmails.includes(u.email));

    // Insert new users
    await authModel.insertMany(newUsers);

    // Cleanup uploaded file
    fs.unlinkSync(filePath);

    res
      .status(200)
      .json({ message: `${newUsers.length} users imported successfully.` });
  } catch (err) {
    console.error("Error importing users:", err);
    res.status(500).json({ message: "Failed to import users." });
  }
};
