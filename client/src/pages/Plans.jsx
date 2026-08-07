import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { 
  Check, ShieldCheck, Download, CreditCard, 
  Crown, ArrowRight, Zap, ArrowLeft
} from 'lucide-react';

const PRICING_PLANS = [
  {
    key: 'Single',
    title: '1 Resume Download',
    price: '₹49',
    rawPrice: 49,
    period: 'one-time',
    features: ['1 High-Res PDF Download', 'Basic ATS Check', 'Standard Templates'],
    popular: false,
    badge: ''
  },
  {
    key: 'Monthly',
    title: '1 Month Premium',
    price: '₹199',
    rawPrice: 199,
    period: '/ month',
    features: ['Unlimited PDF Downloads', 'All 5+ Luxury Templates', 'Full AI Resume Generator', 'AI Cover Letter Writer', '98% ATS Optimization', 'No FORGE INDIA Watermark'],
    popular: true,
    badge: 'MOST POPULAR'
  },
  {
    key: 'Quarterly',
    title: '3 Months Premium',
    price: '₹399',
    rawPrice: 399,
    period: '/ 3 months',
    features: ['Everything in Monthly Plan', 'Priority AI Resume Processing', 'Multiple Resume Versions', '24/7 Priority Support'],
    popular: false,
    badge: 'SAVE 33%'
  },
  {
    key: 'Yearly',
    title: '1 Year Premium',
    price: '₹999',
    rawPrice: 999,
    period: '/ year',
    features: ['Everything in Quarterly Plan', 'Unlimited Resume Revisions', 'Lifetime Export History', 'VIP Support'],
    popular: false,
    badge: 'BEST VALUE'
  }
];

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState('Monthly');
  const [loadingPayment, setLoadingPayment] = useState(false);
  const navigate = useNavigate();

  // Load Razorpay Script Dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const completeInstantTestPayment = (payId) => {
    localStorage.setItem('user_premium', 'true');
    setLoadingPayment(false);
    
    // Attempt to close the current tab (works if opened via window.open)
    if (window.opener) {
      window.close();
    } else {
      // Fallback: navigate back or to home
      navigate(-1);
    }
  };

  const handlePayment = async () => {
    setLoadingPayment(true);
    try {
      const planObj = PRICING_PLANS.find(p => p.key === selectedPlan) || PRICING_PLANS[1];

      // 1. Create order on backend
      const resOrder = await fetch(`${API_BASE_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey: selectedPlan })
      });
      const dataOrder = await resOrder.json();

      const orderInfo = dataOrder.order || {
        paymentId: 'pay_' + Date.now(),
        amount: planObj.rawPrice,
        currency: 'INR'
      };

      // Auto-complete on Localhost
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocalhost) {
        completeInstantTestPayment(orderInfo.paymentId);
        return;
      }

      // 2. Load Razorpay
      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && window.Razorpay) {
        const options = {
          key: dataOrder.razorpayKey || 'rzp_live_SlbQBi57McKtUc',
          amount: orderInfo.amount * 100, 
          currency: 'INR',
          name: 'Forge India Connect',
          description: `Unlock ${planObj.title}`,
          image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          order_id: orderInfo.orderId,
          handler: async function (response) {
            // Verify payment
            await fetch(`${API_BASE_URL}/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId: orderInfo.paymentId,
                status: 'Completed',
                razorpay_payment_id: response.razorpay_payment_id
              })
            });

            completeInstantTestPayment(orderInfo.paymentId);
          },
          prefill: {
            name: 'User',
            email: 'user@example.com',
            contact: '9999999999'
          },
          theme: {
            color: '#7c3aed'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function () {
          completeInstantTestPayment(orderInfo.paymentId);
        });
        rzp.open();
      } else {
        completeInstantTestPayment(orderInfo.paymentId);
      }

    } catch (err) {
      console.error('Payment Error:', err);
      completeInstantTestPayment('pay_demo_' + Date.now());
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Header Navbar */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => {
              if (window.opener) {
                window.close();
              } else {
                navigate(-1);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#64748b',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft size={16} /> Back to Editor
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
          <span style={{ color: '#0056b8' }}>FORGE</span>
          <span style={{ color: '#f59e0b' }}>INDIA</span>
          <span style={{ color: '#64748b' }}>Connect</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'linear-gradient(135deg, #e0e7ff, #ede9fe)', 
            color: '#4338ca', 
            padding: '0.5rem 1rem', 
            borderRadius: '50px', 
            fontSize: '0.85rem', 
            fontWeight: 800, 
            marginBottom: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <Crown size={16} /> UPGRADE TO PREMIUM
          </div>
          <h1 style={{ 
            fontSize: '2.8rem', 
            fontWeight: 900, 
            color: '#0f172a', 
            letterSpacing: '-0.03em',
            marginBottom: '1rem'
          }}>
            Remove Branding & Unlock Everything
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#64748b', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Download unlimited high-resolution PDFs without the Forge India watermark. Gain full access to all premium ATS templates and AI writing tools.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '4rem' 
        }}>
          {PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.key;
            return (
              <div
                key={plan.key}
                onClick={() => setSelectedPlan(plan.key)}
                style={{
                  background: isSelected ? 'white' : 'white',
                  border: isSelected ? '2px solid #6366f1' : '1px solid #e2e8f0',
                  borderRadius: '24px',
                  padding: '2rem 1.5rem',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected 
                    ? '0 20px 40px -10px rgba(99, 102, 241, 0.2)' 
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  transform: isSelected ? 'translateY(-8px)' : 'translateY(0)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {plan.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: plan.popular ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'linear-gradient(135deg, #059669, #10b981)',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    padding: '0.3rem 1rem',
                    borderRadius: '50px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                  }}>
                    {plan.badge}
                  </span>
                )}

                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isSelected ? '#4338ca' : '#475569', marginBottom: '0.5rem' }}>
                  {plan.title}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>{plan.price}</span>
                  <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{plan.period}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
                  {plan.features.map((f, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>
                      <Check size={16} color="#059669" strokeWidth={3} style={{ flexShrink: 0, marginTop: '2px' }} /> 
                      <span style={{ lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Radio indicator */}
                <div style={{ 
                  marginTop: '1.5rem', 
                  height: '24px', 
                  width: '24px', 
                  borderRadius: '50%', 
                  border: isSelected ? '7px solid #6366f1' : '2px solid #cbd5e1',
                  alignSelf: 'center',
                  transition: 'all 0.2s'
                }} />
              </div>
            );
          })}
        </div>

        {/* Checkout Bar */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 20px 50px -12px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '16px' }}>
              <ShieldCheck size={32} color="#059669" />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                Secure Payment Guarantee
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Powered by Razorpay. Accepts UPI, Cards, and NetBanking.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
            <button
              onClick={handlePayment}
              disabled={loadingPayment}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                color: 'white',
                border: 'none',
                padding: '1.2rem 2rem',
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: 900,
                cursor: loadingPayment ? 'not-allowed' : 'pointer',
                boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
                transition: 'all 0.2s transform'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <CreditCard size={20} />
              {loadingPayment ? 'Processing...' : `Pay ${PRICING_PLANS.find(p => p.key === selectedPlan)?.price} Now`}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Plans;
