const Template = require("../models/Template.js");

const getAdminTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("Admin templates error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
    });
  }
};

const createTemplate = async (req, res) => {
  try {
    const { name, description, previewImage, category, isActive } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Template name is required",
      });
    }

    const template = await Template.create({
      name,
      description: description || "",
      previewImage: previewImage || "",
      category: category || "Professional",
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Template created successfully",
      template,
    });
  } catch (error) {
    console.error("Create template error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create template",
    });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    res.json({
      success: true,
      message: "Template updated successfully",
      template,
    });
  } catch (error) {
    console.error("Update template error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update template",
    });
  }
};

const toggleTemplateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    template.isActive = !template.isActive;

    await template.save();

    res.json({
      success: true,
      message: template.isActive ? "Template activated" : "Template deactivated",
      template,
    });
  } catch (error) {
    console.error("Template status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update template status",
    });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findByIdAndDelete(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    res.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Delete template error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete template",
    });
  }
};

module.exports = {
  getAdminTemplates,
  createTemplate,
  updateTemplate,
  toggleTemplateStatus,
  deleteTemplate,
};
