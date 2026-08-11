import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, Save, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const PlanForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: 30,
    popular: false,
    isActive: true,
  });

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchPlan();
    }
  }, [id]);

  const fetchPlan = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_BASE_URL}/admin/plans`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const plan = response.data.plans.find((item) => item._id === id);

      if (!plan) {
        alert("Plan not found");
        navigate("/admin/plans");
        return;
      }

      setFormData({
        name: plan.name || "",
        description: plan.description || "",
        price: plan.price || "",
        duration: plan.duration || 30,
        popular: plan.popular || false,
        isActive: plan.isActive ?? true,
      });

      setFeatures(plan.features || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load plan");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addFeature = () => {
    const value = featureInput.trim();

    if (!value) return;

    setFeatures((prev) => [...prev, value]);
    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFeatureKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Enter a plan name.");
      return;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      alert("Enter a valid price.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        duration: Number(formData.duration),
        features,
        popular: formData.popular,
        isActive: formData.isActive,
      };

      if (isEdit) {
        await axios.put(
          `${API_BASE_URL}/admin/plans/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(`${API_BASE_URL}/admin/plans`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      alert(
        isEdit ? "Plan updated successfully!" : "Plan created successfully!"
      );

      navigate("/admin/plans");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to save plan.");
    } finally {
      setLoading(false);
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
                  onClick={() => navigate("/admin/plans")}
                >
                  <ArrowLeft size={17} />
                  Back to Plans
                </button>

                <h2>{isEdit ? "Edit Plan" : "Add Plan"}</h2>

                <p>
                  {isEdit
                    ? "Update your subscription plan."
                    : "Create a new subscription plan."}
                </p>
              </div>
            </div>

            <form className="admin-template-form" onSubmit={handleSubmit}>
              {/* BASIC INFORMATION */}

              <div className="admin-form-card">
                <h3>Plan Information</h3>

                <p className="admin-form-description">
                  Configure the name, price and duration of this plan.
                </p>

                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>Plan Name</label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Example: Pro"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Price (INR)</label>

                    <input
                      type="number"
                      name="price"
                      min="0"
                      placeholder="199"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>Duration (Days)</label>

                    <input
                      type="number"
                      name="duration"
                      min="1"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Description</label>

                    <input
                      type="text"
                      name="description"
                      placeholder="Best for professionals"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* FEATURES */}

              <div className="admin-form-card">
                <h3>Plan Features</h3>

                <p className="admin-form-description">
                  Add the features users receive with this plan.
                </p>

                <div className="plan-feature-input">
                  <input
                    type="text"
                    placeholder="Example: Unlimited Resume Downloads"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={handleFeatureKeyDown}
                  />

                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={addFeature}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                <div className="plan-feature-list">
                  {features.map((feature, index) => (
                    <div
                      className="plan-feature-item"
                      key={`${feature}-${index}`}
                    >
                      <span>✓ {feature}</span>

                      <button type="button" onClick={() => removeFeature(index)}>
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* OPTIONS */}

              <div className="admin-form-card">
                <h3>Plan Options</h3>

                <label className="admin-switch-row">
                  <div>
                    <strong>Popular Plan</strong>

                    <span>Show a "Most Popular" badge.</span>
                  </div>

                  <input
                    type="checkbox"
                    name="popular"
                    checked={formData.popular}
                    onChange={handleChange}
                  />
                </label>

                <label className="admin-switch-row">
                  <div>
                    <strong>Active Plan</strong>

                    <span>Allow users to see and purchase this plan.</span>
                  </div>

                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                </label>
              </div>

              {/* ACTIONS */}

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => navigate("/admin/plans")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={loading}
                >
                  <Save size={17} />

                  {loading ? "Saving..." : isEdit ? "Update Plan" : "Save Plan"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlanForm;
