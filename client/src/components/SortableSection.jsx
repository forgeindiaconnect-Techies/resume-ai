import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Trash2 } from 'lucide-react';

export const SortableSection = ({ id, label, isVisible = true, isCustom = false, onToggleVisibility, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 99 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.55rem 0.75rem',
        marginBottom: '0.45rem',
        background: isDragging ? '#e2e8f0' : isVisible ? '#ffffff' : '#f8fafc',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        boxShadow: isDragging ? '0 8px 20px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {/* Drag Handle Icon ☰ */}
        <div
          {...attributes}
          {...listeners}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'grab',
            color: '#64748b',
            padding: '2px 4px'
          }}
          title="Click and hold ☰ to drag"
        >
          <GripVertical size={16} />
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isVisible ? '#0f172a' : '#94a3b8' }}>
          {label || id}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        {/* Show / Hide Visibility Toggle Button */}
        {onToggleVisibility && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(id);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isVisible ? '#0284c7' : '#94a3b8',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center'
            }}
            title={isVisible ? 'Hide Section' : 'Show Section'}
          >
            {isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        )}

        {/* Optional Delete Button for Custom Sections */}
        {isCustom && onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#ef4444',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Delete Custom Section"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SortableSection;
