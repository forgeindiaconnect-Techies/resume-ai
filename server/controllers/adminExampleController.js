const ResumeExample = require("../models/ResumeExample");
const cloudinary = require("../config/cloudinary");

exports.getAllExamples = async (req, res) => {
  try {
    const examples = await ResumeExample.find().sort({ createdAt: -1 });
    res.json({ success: true, examples });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch resume examples" });
  }
};

exports.getExampleById = async (req, res) => {
  try {
    const example = await ResumeExample.findById(req.params.id);
    if (!example) {
      return res.status(404).json({ success: false, message: "Resume example not found" });
    }
    res.json({ success: true, example });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch resume example" });
  }
};

exports.createExample = async (req, res) => {
  try {
    const { title, category, description, isActive } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    let previewImage = "";

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "resume-builder/examples",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(req.file.buffer);
      });
      previewImage = uploadResult.secure_url;
    }

    const example = await ResumeExample.create({
      title,
      category: category || "Professional",
      description: description || "",
      previewImage,
      isActive: isActive === "false" ? false : true,
    });

    res.status(201).json({ success: true, message: "Resume example created successfully", example });
  } catch (error) {
    console.error("Create example error:", error);
    res.status(500).json({ success: false, message: "Failed to create resume example", error: error.message });
  }
};

exports.updateExample = async (req, res) => {
  try {
    const example = await ResumeExample.findById(req.params.id);
    if (!example) {
      return res.status(404).json({ success: false, message: "Resume example not found" });
    }

    const { title, category, description, previewImage, resumeFile, isActive } = req.body;

    if (title !== undefined) example.title = title;
    if (category !== undefined) example.category = category;
    if (description !== undefined) example.description = description;
    if (previewImage !== undefined) example.previewImage = previewImage;
    if (resumeFile !== undefined) example.resumeFile = resumeFile;
    if (isActive !== undefined) {
      example.isActive = isActive === "true" || isActive === true;
    }

    await example.save();
    res.json({ success: true, message: "Resume example updated successfully", example });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update resume example" });
  }
};

exports.toggleExampleStatus = async (req, res) => {
  try {
    const example = await ResumeExample.findById(req.params.id);
    if (!example) {
      return res.status(404).json({ success: false, message: "Resume example not found" });
    }

    example.isActive = !example.isActive;
    await example.save();

    res.json({
      success: true,
      message: example.isActive ? "Example activated" : "Example deactivated",
      example,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

exports.deleteExample = async (req, res) => {
  try {
    const example = await ResumeExample.findById(req.params.id);
    if (!example) {
      return res.status(404).json({ success: false, message: "Resume example not found" });
    }

    await ResumeExample.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Resume example deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete resume example" });
  }
};
