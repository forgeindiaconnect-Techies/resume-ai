import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, Upload, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AddExample = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Professional",
    description: "",
    isActive: true,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5 MB.");
      return;
    }

    setPreviewImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter an example title.");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("adminToken");
      const data = new FormData();

      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("isActive", formData.isActive);

      if (previewImage?.file) {
        data.append("previewImage", previewImage.file);
      }

      await axios.post(`${API_BASE_URL}/admin/examples`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Resume example created successfully!");
      navigate("/admin/examples");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Failed to create resume example."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
            <div className="admin-page-title">
              <div>
                <button
                  className="admin-back-button"
                  onClick={() => navigate("/admin/examples")}
                >
                  <ArrowLeft size={17} />
                  Back to Examples
                </button>
                <h2>Add Resume Example</h2>
                <p>Add an example resume for users to view.</p>
              </div>
            </div>

            <form className="admin-template-form" onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="admin-form-card">
                <h3>Example Information</h3>
                <p className="admin-form-description">
                  Enter the basic information for this resume example.
                </p>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>Example Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Example: Software Developer Resume"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option>Professional</option>
                      <option>Software Developer</option>
                      <option>Designer</option>
                      <option>Marketing</option>
                      <option>Fresher</option>
                      <option>Executive</option>
                    </select>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Describe this resume example..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="admin-form-card">
                <h3>Resume Preview</h3>
                <p className="admin-form-description">
                  Upload the image that users will see in the examples section.
                </p>
                <label className="template-upload-box">
                  {previewImage ? (
                    <img src={previewImage.preview} alt="Resume example preview" />
                  ) : (
                    <>
                      <Upload size={30} />
                      <strong>Upload Resume Preview</strong>
                      <span>JPG, PNG or WEBP — Maximum 5 MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    hidden
                  />
                </label>
              </div>

              {/* Status */}
              <div className="admin-form-card">
                <h3>Visibility</h3>
                <label className="admin-switch-row">
                  <div>
                    <strong>Active Example</strong>
                    <span>Show this example to users.</span>
                  </div>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => navigate("/admin/examples")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={saving}
                >
                  <Save size={17} />
                  {saving ? "Saving..." : "Save Example"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddExample;
