import React, { useState, useRef, useEffect } from 'react';

const SignatureBlock = ({ signature }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging.current) {
        setOffset({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y
        });
      }
    };
    
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };
    
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    e.preventDefault(); // Prevent native image drag
  };

  if (!signature || !signature.type) return null;

  const { type, text, font, url, size, position } = signature;
  
  if (!text && !url) return null;

  const alignItems = position === 'left' ? 'flex-start' : position === 'center' ? 'center' : 'flex-end';
  const widthPercentage = size || 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems, marginTop: '2.5rem', width: '100%', padding: '0 2rem' }}>
      <div 
        onMouseDown={handleMouseDown}
        style={{ 
          transform: `translate(${offset.x}px, ${offset.y}px)`, 
          cursor: 'move', 
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 50
        }}
        title="Drag to reposition signature"
      >
        {url && (
          <img 
            src={url} 
            alt="Signature" 
            style={{ width: `${(widthPercentage / 100) * 150}px`, maxHeight: '80px', objectFit: 'contain', marginBottom: text ? '0.5rem' : 0, pointerEvents: 'none' }} 
          />
        )}
        {text && (
          <div style={{ fontFamily: `"${font}", cursive`, fontSize: `${(widthPercentage / 100) * 2.5}rem`, color: '#1e293b', lineHeight: 1 }}>
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureBlock;
