import authModel from "../models/authModel.js";
import notificationModel from "../models/notificationModel.js";

// Send Notification
export const sendNotification = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required!",
      });
    }

    let notifications = [];

    if (userId) {
      // Send notification to a specific user
      const user = await authModel.findById(userId).select("name email");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      const notification = await notificationModel.create({
        userId: user._id,
        message,
      });

      notifications.push(notification);
    } else {
      // Send notification to all users
      const users = await authModel.find().select("_id");

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No users found!",
        });
      }

      const notificationData = users.map((user) => ({
        userId: user._id,
        message,
      }));

      notifications = await notificationModel.insertMany(notificationData);
    }

    res.status(200).json({
      success: true,
      message: "Notification(s) sent successfully!",
      notifications,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while sending notification, please try again!",
      error: error.message,
    });
  }
};

// Fetch All Notifications
export const fetchAllNotifications = async (req, res) => {
  try {
    const userId = req.params.id;
    const notifications = await notificationModel
      .find({ userId: userId, status: false })
      .populate("userId", "name email");

    res.status(200).send({
      success: true,
      message: "All notifications list!",
      notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while fetch all notifications, please try again!",
      error: error,
    });
  }
};

// Update Notification Status
export const updateNotificationStatus = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const existingNotification = await notificationModel.findById(
      notificationId
    );

    if (!existingNotification) {
      return res.status(404).send({
        success: false,
        message: "Notification not found!",
      });
    }

    const notifications = await notificationModel.findByIdAndUpdate(
      { _id: existingNotification._id },
      {
        status: true,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Notification updated successfully!",
      notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while update notification, please try again!",
      error: error,
    });
  }
};

// Delete All Notifications
export const deleteAllNotifications = async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (!notificationIds) {
      return res.status(400).send({
        success: false,
        message: "Notification Ids is required!",
      });
    }

    await notificationModel.deleteMany({ _id: { $in: notificationIds } });

    res.status(200).send({
      success: true,
      message: "All notifications deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message:
        "Error occured while delete all notifications, please try again!",
      error: error,
    });
  }
};
