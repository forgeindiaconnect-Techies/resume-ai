import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Search, FileText, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminExamples = () => {
  const navigate = useNavigate();

  const [examples, setExamples] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamples();
  }, []);

  const fetchExamples = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_BASE_URL}/admin/examples`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExamples(response.data.examples || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteExample = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this example?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(
        `${API_BASE_URL}/admin/examples/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchExamples();
    } catch (error) {
      alert("Failed to delete example");
    }
  };

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.patch(
        `${API_BASE_URL}/admin/examples/${id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchExamples();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const filteredExamples = examples.filter((example) =>
    `${example.title} ${example.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
            <div className="admin-page-title">
              <div>
                <h2>Resume Examples</h2>
                <p>Manage the example resumes shown to your users.</p>
              </div>

              <button
                className="admin-primary-button"
                onClick={() => navigate("/admin/examples/add")}
              >
                <Plus size={18} />
                Add Example
              </button>
            </div>

            <div className="admin-template-toolbar">
              <div className="admin-table-search">
                <Search size={18} />
                <input
                  placeholder="Search examples..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <span>{examples.length} Examples</span>
            </div>

            {loading ? (
              <div className="admin-table-message">
                Loading examples...
              </div>
            ) : filteredExamples.length === 0 ? (
              <div className="admin-empty-template">
                <FileText size={40} />
                <h3>No resume examples found</h3>
                <p>Add your first example resume.</p>
                <button
                  className="admin-primary-button"
                  onClick={() => navigate("/admin/examples/add")}
                >
                  <Plus size={17} />
                  Add Example
                </button>
              </div>
            ) : (
              <div className="admin-example-grid">
                {filteredExamples.map((example) => (
                  <div className="admin-example-card" key={example._id}>
                    <div className="admin-example-preview">
                      {example.previewImage ? (
                        <img
                          src={example.previewImage}
                          alt={example.title}
                        />
                      ) : (
                        <FileText size={45} />
                      )}
                    </div>

                    <div className="admin-example-info">
                      <div>
                        <h3>{example.title}</h3>
                        <p>{example.category}</p>
                      </div>

                      <span
                        className={
                          example.isActive
                            ? "template-active"
                            : "template-inactive"
                        }
                      >
                        {example.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="admin-example-actions">
                      <button
                        onClick={() =>
                          navigate(`/admin/examples/edit/${example._id}`)
                        }
                      >
                        <Edit size={15} />
                        Edit
                      </button>

                      <button onClick={() => toggleStatus(example._id)}>
                        {example.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button onClick={() => deleteExample(example._id)}>
                        <Trash2 size={15} />
                        Delete
                      </button>
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

export default AdminExamples;
