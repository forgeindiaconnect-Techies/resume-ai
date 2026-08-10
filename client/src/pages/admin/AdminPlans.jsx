import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

const AdminPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get("http://localhost:5000/api/admin/plans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPlans(response.data.plans || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.patch(
        `http://localhost:5000/api/admin/plans/${id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPlans();
    } catch (error) {
      alert("Failed to update plan");
    }
  };

  const deletePlan = async (id) => {
    if (!window.confirm("Delete this plan?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(`http://localhost:5000/api/admin/plans/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchPlans();
    } catch (error) {
      alert("Failed to delete plan");
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
                <h2>Plans</h2>
                <p>Manage your Resume Builder subscription plans.</p>
              </div>

              <button
                className="admin-primary-button"
                onClick={() => navigate("/admin/plans/add")}
              >
                <Plus size={17} />
                Add Plan
              </button>
            </div>

            {loading ? (
              <div className="admin-table-message">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="admin-empty-template">
                <h3>No plans available</h3>
                <p>Create your first subscription plan.</p>
              </div>
            ) : (
              <div className="admin-plans-grid">
                {plans.map((plan) => (
                  <div className="admin-plan-card" key={plan._id}>
                    {plan.popular && (
                      <div className="popular-badge">Most Popular</div>
                    )}

                    <div className="admin-plan-header">
                      <div>
                        <h3>{plan.name}</h3>
                        <p>{plan.description}</p>
                      </div>

                      <span
                        className={
                          plan.isActive
                            ? "template-active"
                            : "template-inactive"
                        }
                      >
                        {plan.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="admin-plan-price">
                      <strong>₹{plan.price}</strong>
                      <span>/ {plan.duration} days</span>
                    </div>

                    <div className="admin-plan-features">
                      {plan.features.map((feature, index) => (
                        <div key={index}>
                          <Check size={15} />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="admin-plan-actions">
                      <button onClick={() => navigate(`/admin/plans/edit/${plan._id}`)}>
                        <Edit size={15} />
                        Edit
                      </button>

                      <button onClick={() => toggleStatus(plan._id)}>
                        {plan.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button onClick={() => deletePlan(plan._id)}>
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

export default AdminPlans;
