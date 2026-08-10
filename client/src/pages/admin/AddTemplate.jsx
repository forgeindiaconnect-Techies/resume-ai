import React, { useState } from "react";
import { Upload, X, ArrowLeft, Save } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

const AddTemplate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "Professional",
    description: "",
    isActive: true,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage({
          file: file,
          url: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      const data = new FormData();

      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("isActive", formData.isActive);

      if (previewImage?.file) {
        data.append("previewImage", previewImage.file);
      }

      await axios.post("http://localhost:5000/api/admin/templates", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Template created successfully!");
      navigate("/admin/templates");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create template");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
            <div className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
              <button 
                onClick={() => navigate("/admin/templates")}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', padding: '5px' }}
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>Add New Template</h2>
                <p style={{ margin: '5px 0 0', color: '#6b7280', fontSize: '14px' }}>Upload and configure a new resume template.</p>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '30px', maxWidth: '800px' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Template Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                    placeholder="e.g., Modern Professional"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', backgroundColor: '#fff' }}
                  >
                    <option value="Professional">Professional</option>
                    <option value="Creative">Creative</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Modern">Modern</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                    placeholder="Short description of this template"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Preview Image (Required)</label>
                  
                  {previewImage ? (
                    <div style={{ position: 'relative', width: 'fit-content' }}>
                      <img 
                        src={previewImage.url} 
                        alt="Preview" 
                        style={{ height: '240px', borderRadius: '8px', border: '1px solid #e5e7eb', objectFit: 'cover' }} 
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewImage(null)}
                        style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label style={{ border: '2px dashed #d1d5db', borderRadius: '12px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f9fafb', color: '#6b7280' }}>
                      <Upload size={32} style={{ marginBottom: '10px', color: '#9ca3af' }} />
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Click to upload image</span>
                      <span style={{ fontSize: '12px', marginTop: '5px' }}>JPG, PNG or WEBP (Max 5MB)</span>
                      <input 
                        type="file" 
                        accept="image/jpeg, image/png, image/webp" 
                        onChange={handleImageChange} 
                        style={{ display: 'none' }} 
                        required
                      />
                    </label>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isActive" style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
                    Active (Visible to users)
                  </label>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !previewImage}
                    className="admin-primary-button"
                    style={{ opacity: (isSubmitting || !previewImage) ? 0.7 : 1 }}
                  >
                    <Save size={18} />
                    {isSubmitting ? "Saving..." : "Save Template"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddTemplate;
