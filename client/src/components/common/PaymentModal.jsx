import React, { useState } from 'react';
import { RESUME_PRICING } from '../../config/pricing';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onSuccessDownload, source = 'create' }) => {
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const currentPricing = RESUME_PRICING[source] || RESUME_PRICING.create;

  if (!isOpen) return null;

  const handlePayment = () => {
    console.log("Payment required");
    console.log("Source:", source);
    console.log("Amount:", currentPricing?.price);
    
    // Simulate payment completion for testing purposes
    setLoadingPayment(true);
    setTimeout(() => {
      localStorage.setItem('user_premium', 'true');
      setLoadingPayment(false);
      onClose();
      if (onSuccessDownload) {
        onSuccessDownload();
      }
    }, 1500);
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <button
          className="payment-close"
          onClick={onClose}
        >
          ×
        </button>

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
      </div>
    </div>
  );
};

export default PaymentModal;
