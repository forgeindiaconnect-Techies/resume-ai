import React from 'react';
import ModernResumeTemplate from './builder/ModernResumeTemplate';

const ResumePreview = ({ data, color, font }) => {
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
      <ModernResumeTemplate
        data={data}
        customColor={color}
        customFont={font}
      />
    </div>
  );
};

export default ResumePreview;
