import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check } from "lucide-react";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/plans");
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPlan = async (plan) => {
    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        alert("Razorpay Checkout failed to load.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first to buy a plan.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/payments/create-order",
        {
          planId: plan._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { order, keyId } = response.data;

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Your Resume Builder",
        description: plan.name,
        order_id: order.id,
        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await axios.post(
              "http://localhost:5000/api/payments/verify",
              paymentResponse,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyResponse.data.success) {
              alert("Payment successful!");
              window.location.href = "/payment-success";
            }
          } catch (error) {
            alert("Payment verification failed.");
          }
        },
        theme: {
          color: "#111827",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to start payment.");
    }
  };

  if (loading) {
    return <div>Loading plans...</div>;
  }

  return (
    <div className="pricing-page">
      <div className="pricing-header">
          <h1>Choose Your Plan</h1>
          <p>Create professional resumes without limitations.</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div className="pricing-card" key={plan._id}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}

              <h2>{plan.name}</h2>
              <p>{plan.description}</p>

              <div className="pricing-price">
                ₹{plan.price}
                <span>/ {plan.duration} days</span>
              </div>

              <div className="pricing-features">
                {plan.features.map((feature, index) => (
                  <div key={index}>
                    <Check size={16} />
                    {feature}
                  </div>
                ))}
              </div>

              <button onClick={() => handleBuyPlan(plan)}>Buy Now</button>
            </div>
          ))}
        </div>
      </div>
  );
};

export default Pricing;
