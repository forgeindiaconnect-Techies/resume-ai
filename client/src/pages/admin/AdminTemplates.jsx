import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Eye, EyeOff, Trash2, Palette } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

const AdminTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    previewImage: "",
    category: "Professional",
    isActive: true,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const getToken = () => localStorage.getItem("adminToken");

  const fetchTemplates = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/templates", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setTemplates(response.data.templates || []);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingTemplate(null);
    setForm({
      name: "",
      description: "",
      previewImage: "",
      category: "Professional",
      isActive: true,
    });
    setShowForm(true);
  };

  const openEditForm = (template) => {
    setEditingTemplate(template);
    setForm({
      name: template.name || "",
      description: template.description || "",
      previewImage: template.previewImage || "",
      category: template.category || "Professional",
      isActive: template.isActive !== false,
    });
    setShowForm(true);
  };

  const saveTemplate = async () => {
    try {
      if (!form.name.trim()) {
        alert("Please enter template name");
        return;
      }

      if (editingTemplate) {
        await axios.put(
          `http://localhost:5000/api/admin/templates/${editingTemplate._id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/admin/templates", form, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
      }

      setShowForm(false);
      fetchTemplates();
    } catch (error) {
      console.error("Save template error:", error);
      alert("Failed to save template");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/templates/${id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      fetchTemplates();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTemplate = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this template?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/templates/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      fetchTemplates();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
            {/* Header */}
            <div className="admin-page-title">
              <div>
                <h2>Templates</h2>
                <p>Manage resume templates available to users.</p>
              </div>

              <button className="admin-primary-button" onClick={openCreateForm}>
                <Plus size={17} />
                Add Template
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="template-form-card">
                <h3>{editingTemplate ? "Edit Template" : "Create Template"}</h3>

                <div className="settings-grid">
                  <div className="settings-field">
                    <label>Template Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Modern Resume"
                    />
                  </div>

                  <div className="settings-field">
                    <label>Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                    >
                      <option>Professional</option>
                      <option>Modern</option>
                      <option>Creative</option>
                      <option>Minimal</option>
                    </select>
                  </div>
                </div>

                <div className="settings-field">
                  <label>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Professional resume template"
                    rows={4}
                  />
                </div>

                <div className="settings-field">
                  <label>Preview Image URL</label>
                  <input
                    type="text"
                    value={form.previewImage}
                    onChange={(e) => handleChange("previewImage", e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="template-form-actions">
                  <button
                    className="admin-secondary-button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button className="admin-primary-button" onClick={saveTemplate}>
                    Save Template
                  </button>
                </div>
              </div>
            )}

            {/* Templates */}
            {loading ? (
              <div className="admin-table-message">Loading templates...</div>
            ) : templates.length === 0 ? (
              <div className="admin-table-message">
                <Palette size={40} />
                <h3>No templates found</h3>
                <p>Add your first resume template.</p>
              </div>
            ) : (
              <div className="admin-template-grid">
                {templates.map((template) => (
                  <div className="admin-template-card" key={template._id}>
                    <div className="template-preview">
                      {template.previewImage ? (
                        <img src={template.previewImage} alt={template.name} />
                      ) : (
                        <div className="template-preview-placeholder">
                          <Palette size={35} />
                        </div>
                      )}
                    </div>

                    <div className="template-card-content">
                      <div className="template-card-title">
                        <div>
                          <h3>{template.name}</h3>
                          <span>{template.category}</span>
                        </div>

                        {template.isActive ? (
                          <span className="user-active-status">Active</span>
                        ) : (
                          <span className="user-blocked-status">Inactive</span>
                        )}
                      </div>

                      <p>{template.description || "No description"}</p>

                      <div className="template-card-actions">
                        <button onClick={() => openEditForm(template)}>
                          <Edit size={15} />
                          Edit
                        </button>

                        <button onClick={() => toggleStatus(template._id)}>
                          {template.isActive ? (
                            <>
                              <EyeOff size={15} />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye size={15} />
                              Show
                            </>
                          )}
                        </button>

                        <button
                          className="template-delete-button"
                          onClick={() => deleteTemplate(template._id)}
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTemplates;
