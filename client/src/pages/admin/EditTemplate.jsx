import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { ArrowLeft, Save } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

const EditTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplate();
  }, []);

  const fetchTemplate = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_BASE_URL}/admin/templates/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const template = response.data.template;

      setFormData({
        name: template.name || "",
        category: template.category || "",
        description: template.description || "",
        isActive: template.isActive ?? true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${API_BASE_URL}/admin/templates/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Template updated successfully");
      navigate("/admin/templates");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update template"
      );
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
                <h2 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>Edit Template</h2>
                <p style={{ margin: '5px 0 0', color: '#6b7280', fontSize: '14px' }}>Modify the details of your template.</p>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '30px', maxWidth: '800px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Template Name</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Category</label>
                    <input
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                        })
                      }
                      style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Description</label>
                    <textarea
                      rows="4"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                    />
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.checked,
                        })
                      }
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}>Active Template (Visible to users)</span>
                  </label>

                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      className="admin-primary-button"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>

                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditTemplate;
