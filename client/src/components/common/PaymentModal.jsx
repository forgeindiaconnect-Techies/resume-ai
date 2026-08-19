import React, { useState, useEffect } from 'react';
import { RESUME_PRICING } from '../../config/pricing';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onSuccessDownload, source = 'create' }) => {
  const [step, setStep] = useState('payment');
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const currentPricing = RESUME_PRICING[source] || RESUME_PRICING.create;

  useEffect(() => {
    if (isOpen) {
      setStep('payment');
      setLoadingPayment(false);
      setSelectedMethod('UPI');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayment = () => {
    setLoadingPayment(true);
    setTimeout(() => {
      localStorage.setItem('user_premium', 'true');
      setLoadingPayment(false);
      setStep('success');
      if (onSuccessDownload) {
        onSuccessDownload();
      }
    }, 1500);
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal" style={step === 'success' ? { padding: '2.5rem 2rem', maxWidth: '500px' } : {}}>
        <button
          className="payment-close"
          onClick={onClose}
        >
          ×
        </button>

        {step === 'payment' && (
          <>
            <div className="payment-icon">
              ✓
            </div>

            <h2>Your Resume is Ready!</h2>

            <p>
              Your professional resume has been completed.
            </p>

            <div className="payment-summary">
              <span>{currentPricing?.name}</span>

              <strong>
                ₹{currentPricing?.price}
              </strong>
            </div>

            <div className="payment-benefits">
              <div>✓ High-quality PDF</div>
              <div>✓ No watermark</div>
              <div>✓ Instant download</div>
            </div>

            <div className="payment-methods">
              <p className="payment-methods-title">Select Payment Method</p>
              <div className="payment-method-options">
                {['UPI', 'Card', 'Net Banking'].map(method => (
                  <label 
                    key={method} 
                    className={`payment-method-label ${selectedMethod === method ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={selectedMethod === method}
                      onChange={() => setSelectedMethod(method)}
                      style={{ display: 'none' }}
                    />
                    <span className="payment-method-name">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              className="pay-download-button"
              onClick={handlePayment}
              disabled={loadingPayment}
            >
              {loadingPayment ? 'Processing...' : `Pay via ${selectedMethod} & Download`}
            </button>

            <small>
              One-time payment • Secure checkout
            </small>
          </>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'left', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ width: 65, height: 65, borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>Payment & Download Successful! 🎉</h3>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Company Name</span>
                  <span style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 900 }}>Forge India Connect</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Customer Name</span>
                  <span style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 900 }}>Valued Customer</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Subject</span>
                  <span style={{ fontSize: '0.95rem', color: '#059669', fontWeight: 900 }}>ATS-Friendly Resume Generation</span>
                </div>
                <div style={{ paddingTop: '0.5rem' }}>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, fontWeight: 500 }}>
                    Thank you for choosing Forge India Connect to build your professional profile. We are thrilled to be part of your career journey.
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, fontWeight: 500 }}>
                    Your high-resolution PDF has been successfully generated and downloaded to your device.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: 'white', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' }}
            >
              Continue / Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
