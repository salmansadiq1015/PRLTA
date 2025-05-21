import issuesModel from "../models/issuesModel.js";

// Create Issue
export const createIssue = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (!title || !description) {
      return res.status(400).send({
        success: false,
        message: "Title & Description is required!",
      });
    }

    const issues = await issuesModel.create({
      user: req.user.user._id,
      title,
      description,
      image,
      status: "pending",
    });

    res.status(200).send({
      success: true,
      message: "Issue posted successfully!",
      issues: issues,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while post issue, please try again!",
      error: error,
    });
  }
};

// Update Issue
export const updateIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const { title, description, image } = req.body;

    const existingIssue = await issuesModel.findById(issueId);

    if (!existingIssue) {
      return res.status(404).send({
        success: false,
        message: "Issue not found!",
      });
    }

    const issues = await issuesModel.findByIdAndUpdate(
      { _id: existingIssue._id },
      {
        title: title || existingIssue.title,
        description: description || existingIssue.description,
        image: image || existingIssue.image,
        status: existingIssue.status,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Issue updated successfully!",
      issues: issues,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occured while update issue, please try again!",
      error: error,
    });
  }
};

// Fetch All Issues
export const fetchAllIssues = async (req, res) => {
  try {
    const issues = await issuesModel.find({});

    res.status(200).json({
      success: true,
      message: "Successfully fetched all issues",
      issues,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error, please try again!",
      error: error,
    });
  }
};

// Fetch User Issues
export const fetchUserIssues = async (req, res) => {
  try {
    const userId = req.params.id;
    const issues = await issuesModel.find({ user: userId });

    res.status(200).json({
      success: true,
      message: "Successfully fetched user issues",
      issues,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error, please try again!",
      error: error,
    });
  }
};

// Delete Issue
export const deleteIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const isExist = await issuesModel.findById(issueId);

    if (!isExist) {
      return res
        .status(404)
        .send({ success: false, message: "Issue not found" });
    }

    await issuesModel.findByIdAndDelete(issueId);

    res
      .status(200)
      .send({ success: true, message: "Issue deleted successfully" });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
