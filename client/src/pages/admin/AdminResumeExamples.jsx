import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Eye, EyeOff, Trash2, FileText } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

const AdminResumeExamples = () => {
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExample, setEditingExample] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Professional",
    previewImage: "",
    resumeData: {},
    isActive: true,
  });

  useEffect(() => {
    fetchExamples();
  }, []);

  const token = localStorage.getItem("adminToken");

  const fetchExamples = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/resume-examples", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExamples(response.data.examples || []);
    } catch (error) {
      console.error("Fetch examples error:", error);
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

  const openCreate = () => {
    setEditingExample(null);
    setForm({
      title: "",
      description: "",
      category: "Professional",
      previewImage: "",
      resumeData: {},
      isActive: true,
    });
    setShowForm(true);
  };

  const openEdit = (example) => {
    setEditingExample(example);
    setForm({
      title: example.title || "",
      description: example.description || "",
      category: example.category || "Professional",
      previewImage: example.previewImage || "",
      resumeData: example.resumeData || {},
      isActive: example.isActive !== false,
    });
    setShowForm(true);
  };

  const saveExample = async () => {
    try {
      if (!form.title.trim()) {
        alert("Please enter example title");
        return;
      }

      if (editingExample) {
        await axios.put(
          `http://localhost:5000/api/admin/resume-examples/${editingExample._id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/admin/resume-examples", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setShowForm(false);
      fetchExamples();
    } catch (error) {
      console.error(error);
      alert("Failed to save resume example");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/resume-examples/${id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchExamples();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExample = async (id) => {
    const confirmed = window.confirm("Delete this resume example?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/resume-examples/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchExamples();
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
                <h2>Resume Examples</h2>
                <p>Manage example resumes displayed to users.</p>
              </div>

              <button className="admin-primary-button" onClick={openCreate}>
                <Plus size={17} />
                Add Example
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="template-form-card">
                <h3>{editingExample ? "Edit Resume Example" : "Add Resume Example"}</h3>

                <div className="settings-grid">
                  <div className="settings-field">
                    <label>Example Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Software Developer Resume"
                    />
                  </div>

                  <div className="settings-field">
                    <label>Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                    >
                      <option>Professional</option>
                      <option>Fresher</option>
                      <option>Software Developer</option>
                      <option>Designer</option>
                      <option>Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="settings-field">
                  <label>Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>

                <div className="settings-field">
                  <label>Preview Image URL</label>
                  <input
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

                  <button className="admin-primary-button" onClick={saveExample}>
                    Save Example
                  </button>
                </div>
              </div>
            )}

            {/* List */}
            {loading ? (
              <div className="admin-table-message">Loading examples...</div>
            ) : examples.length === 0 ? (
              <div className="admin-table-message">
                <FileText size={40} />
                <h3>No Resume Examples</h3>
                <p>Add your first example resume.</p>
              </div>
            ) : (
              <div className="admin-template-grid">
                {examples.map((example) => (
                  <div className="admin-template-card" key={example._id}>
                    <div className="template-preview">
                      {example.previewImage ? (
                        <img src={example.previewImage} alt={example.title} />
                      ) : (
                        <div className="template-preview-placeholder">
                          <FileText size={35} />
                        </div>
                      )}
                    </div>

                    <div className="template-card-content">
                      <div className="template-card-title">
                        <div>
                          <h3>{example.title}</h3>
                          <span>{example.category}</span>
                        </div>

                        {example.isActive ? (
                          <span className="user-active-status">Active</span>
                        ) : (
                          <span className="user-blocked-status">Hidden</span>
                        )}
                      </div>

                      <p>{example.description || "No description"}</p>

                      <div className="template-card-actions">
                        <button onClick={() => openEdit(example)}>
                          <Edit size={15} />
                          Edit
                        </button>

                        <button onClick={() => toggleStatus(example._id)}>
                          {example.isActive ? (
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
                          onClick={() => deleteExample(example._id)}
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

export default AdminResumeExamples;
