import React from 'react';
import EnhancvLayout from './layouts/EnhancvLayout';
import ModernLayout from './layouts/ModernLayout';
import CreativeLayout from './layouts/CreativeLayout';
import ProfessionalLayout from './layouts/ProfessionalLayout';
import MinimalLayout from './layouts/MinimalLayout';
import ExecutiveLayout from './layouts/ExecutiveLayout';

const ResumePreview = ({ data, color, font, template }) => {
  const renderTemplate = () => {
    const t = (template || '').toLowerCase();
    const props = { data, customColor: color, customFont: font };

    switch (t) {
      case 'enhancv':
        return <EnhancvLayout {...props} />;
      case 'executive':
        return <ExecutiveLayout {...props} />;
      case 'modern':
        return <ModernLayout {...props} />;
      case 'creative':
        return <CreativeLayout {...props} />;
      case 'professional':
        return <ProfessionalLayout {...props} />;
      case 'minimal':
        return <MinimalLayout {...props} />;
      default:
        return <EnhancvLayout {...props} />;
    }
  };

  return (
    <div style={{
      background: 'white',
      width: '100%',
      maxWidth: '210mm',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #cbd5e1'
    }}>
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
