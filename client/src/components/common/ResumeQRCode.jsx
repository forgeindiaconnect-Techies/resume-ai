import React from 'react';
import { QrCode, ExternalLink } from 'lucide-react';

const ResumeQRCode = ({ 
  url, 
  customQrImage = null,
  label = 'Scan for LinkedIn', 
  size = 56, 
  accentColor = '#2563eb',
  variant = 'compact' // 'compact' | 'sidebar' | 'footer'
}) => {
  const target = customQrImage || url;
  if (!target) return null;

  const isCustomImage = target.startsWith('data:image/') || target.startsWith('blob:') || target.includes('/uploads/');

  // Ensure full valid URL for scanning if it's a URL
  const fullUrl = isCustomImage ? target : (
    target.startsWith('http://') || target.startsWith('https://') 
      ? target 
      : `https://${target}`
  );

  const qrImageUrl = isCustomImage 
    ? target 
    : `https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&data=${encodeURIComponent(fullUrl)}&margin=1`;

  if (variant === 'sidebar') {
    return (
      <div style={{
        marginTop: '0.75rem',
        padding: '0.6rem',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem'
      }}>
        <img 
          src={qrImageUrl} 
          alt="QR Code" 
          style={{ 
            width: size, 
            height: size, 
            borderRadius: '4px', 
            background: '#ffffff', 
            padding: '2px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
          }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <QrCode size={11} /> {label}
          </span>
          <span style={{ fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px' }}>
            Instant mobile profile
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.45rem',
      padding: '0.35rem 0.5rem',
      borderRadius: '6px',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      fontSize: '0.68rem',
      color: '#334155'
    }}>
      <img 
        src={qrImageUrl} 
        alt="QR Code" 
        style={{ 
          width: size, 
          height: size, 
          borderRadius: '3px', 
          background: '#ffffff', 
          padding: '1px',
          border: '1px solid #cbd5e1'
        }} 
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontWeight: 800, color: accentColor || '#1e293b', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
          <QrCode size={10} /> {label}
        </span>
        <span style={{ fontSize: '0.58rem', color: '#64748b' }}>Scan on mobile</span>
      </div>
    </div>
  );
};

export default ResumeQRCode;
