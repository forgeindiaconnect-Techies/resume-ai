const ResumeExample = require("../models/ResumeExample.js");

const getAdminExamples = async (req, res) => {
  try {
    const examples = await ResumeExample.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      examples,
    });
  } catch (error) {
    console.error("Get examples error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume examples",
    });
  }
};

const createResumeExample = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      previewImage,
      resumeData,
      isActive,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Example title is required",
      });
    }

    const example = await ResumeExample.create({
      title,
      description: description || "",
      category: category || "Professional",
      previewImage: previewImage || "",
      resumeData: resumeData || {},
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Resume example created successfully",
      example,
    });
  } catch (error) {
    console.error("Create example error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create resume example",
    });
  }
};

const updateResumeExample = async (req, res) => {
  try {
    const { id } = req.params;

    const example = await ResumeExample.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!example) {
      return res.status(404).json({
        success: false,
        message: "Resume example not found",
      });
    }

    res.json({
      success: true,
      message: "Resume example updated successfully",
      example,
    });
  } catch (error) {
    console.error("Update example error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update resume example",
    });
  }
};

const toggleExampleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const example = await ResumeExample.findById(id);

    if (!example) {
      return res.status(404).json({
        success: false,
        message: "Resume example not found",
      });
    }

    example.isActive = !example.isActive;

    await example.save();

    res.json({
      success: true,
      message: example.isActive ? "Example activated" : "Example hidden",
      example,
    });
  } catch (error) {
    console.error("Example status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update example status",
    });
  }
};

const deleteResumeExample = async (req, res) => {
  try {
    const { id } = req.params;

    const example = await ResumeExample.findByIdAndDelete(id);

    if (!example) {
      return res.status(404).json({
        success: false,
        message: "Resume example not found",
      });
    }

    res.json({
      success: true,
      message: "Resume example deleted successfully",
    });
  } catch (error) {
    console.error("Delete example error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete resume example",
    });
  }
};

module.exports = {
  getAdminExamples,
  createResumeExample,
  updateResumeExample,
  toggleExampleStatus,
  deleteResumeExample,
};
