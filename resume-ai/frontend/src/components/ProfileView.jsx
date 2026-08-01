import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  Star, 
  Edit3, 
  ChevronDown,
  User as UserIcon,
  Check,
  X
} from 'lucide-react';

const ProfileView = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  if (!user) return null;

  const handleSave = () => {
    if (onUpdateUser) {
      onUpdateUser(formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="animate-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ 
        position: 'sticky', 
        top: '0', 
        zIndex: 110, 
        background: 'var(--bg-main)', 
        backdropFilter: 'blur(12px)', 
        padding: '1.5rem 0 1rem',
        margin: '0 -1rem 1.5rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--border)'
      }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>My Profile</h1>
        
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div 
              key="view-btn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1px' }}
            >
              <button 
                onClick={() => setIsEditing(true)}
                className="glass-card" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.6rem 1.25rem', 
                  fontSize: '0.95rem', 
                  fontWeight: 600, 
                  color: 'var(--text-muted)',
                  borderRadius: '12px 0 0 12px',
                  borderRight: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: 'var(--glass)'
                }}
              >
                <Edit3 size={18} /> Edit Profile
              </button>
              <button className="glass-card" style={{ 
                padding: '0.6rem 0.6rem', 
                borderRadius: '0 12px 12px 0',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--glass)'
              }}>
                <ChevronDown size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="edit-btns"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <button 
                onClick={handleCancel}
                className="glass-card" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.6rem 1.25rem', 
                  fontSize: '0.95rem', 
                  fontWeight: 600, 
                  color: '#ef4444', 
                  borderColor: '#ef444433',
                  cursor: 'pointer',
                  background: 'var(--glass)'
                }}
              >
                <X size={18} /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="gradient-btn" 
                style={{ 
                  padding: '0.6rem 1.25rem', 
                  fontSize: '0.95rem',
                  boxShadow: 'var(--shadow-premium)'
                }}
              >
                <Check size={18} /> Save Changes
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginTop: '1rem' }}>
        {/* Profile Header Section */}
        <div style={{ padding: '3rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <div style={{ 
            width: 130, 
            height: 130, 
            borderRadius: '50%', 
            overflow: 'hidden', 
            border: '4px solid var(--border)',
            boxShadow: 'var(--shadow)',
            position: 'relative',
            cursor: isEditing ? 'pointer' : 'default'
          }}>
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"} 
              alt={user?.name || "User Avatar"} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {isEditing && (
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'rgba(0,0,0,0.3)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white'
              }}>
                <Edit3 size={24} />
              </div>
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  style={{ 
                    fontSize: '2.4rem', 
                    fontWeight: 900, 
                    color: 'var(--text-main)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px', 
                    padding: '0.25rem 0.5rem',
                    width: '100%',
                    outline: 'none',
                    background: 'var(--bg-sidebar)'
                  }}
                />
                <input 
                  type="text" 
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 500, 
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)', 
                    borderRadius: '8px', 
                    padding: '0.25rem 0.5rem',
                    width: '100%',
                    outline: 'none',
                    background: 'var(--input-bg)'
                  }}
                />
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{user?.name || 'HR Manager'}</h2>
                <p style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-muted)' }}>{user?.role || 'Professional'}</p>
              </>
            )}
          </div>
        </div>

        {/* Profile Details Section */}
        <div style={{ padding: '1.5rem 3rem' }}>
          <DetailItem 
            icon={Mail} 
            label="Email" 
            value={isEditing ? (formData.email || '') : (user?.email || 'N/A')} 
            isEditing={isEditing}
            onChange={(val) => handleChange('email', val)}
          />
          <DetailItem 
            icon={Phone} 
            label="Phone" 
            value={isEditing ? (formData.phone || '') : (user?.phone || 'N/A')} 
            isEditing={isEditing}
            onChange={(val) => handleChange('phone', val)}
          />
          <DetailItem 
            icon={Star} 
            label="Membership" 
            value={user?.membership || 'Elite Member'} 
            isMembership 
          />
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value, isMembership, isEditing, onChange }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    padding: '1.25rem 0', 
    borderBottom: label === 'Membership' ? 'none' : '1px solid var(--border)' 
  }}>
    <div style={{ width: '200px', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
      <Icon size={18} />
      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{label}</span>
    </div>
    
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {isMembership && (
        <div style={{ 
          width: 22, 
          height: 22, 
          background: 'var(--grad-main)', 
          borderRadius: '6px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          flexShrink: 0
        }}>
          <Star size={12} fill="white" />
        </div>
      )}
      
      {isEditing && !isMembership ? (
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ 
            fontSize: '1rem', 
            fontWeight: 700, 
            color: 'var(--primary)',
            border: '1px solid var(--border)', 
            borderRadius: '8px', 
            padding: '0.4rem 0.75rem',
            width: '100%',
            outline: 'none',
            background: 'var(--bg-sidebar)'
          }}
        />
      ) : (
        <span style={{ 
          fontSize: '1rem', 
          fontWeight: 700, 
          color: isMembership ? 'var(--text-main)' : 'var(--primary)',
          letterSpacing: '0.01em'
        }}>
          {value}
        </span>
      )}
    </div>
  </div>
);

export default ProfileView;
