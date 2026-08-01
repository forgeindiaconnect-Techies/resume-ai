import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { 
  getExamples, createExample, updateExample, deleteExample, uploadPreviewImage 
} from '../services/exampleService';
import { 
  Plus, Edit, Trash2, Upload, Sparkles, Check, X, Shield, Search, Image as ImageIcon
} from 'lucide-react';

const AdminResumeExamples = () => {
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Business',
    industry: 'Business Operations',
    experienceLevel: '2-5 Years',
    template: 'modern',
    previewImage: '',
    atsScore: 95,
    description: '',
    isFeatured: false,
    isPremium: false,
    jsonString: JSON.stringify({
      personalInfo: { fullName: "John Smith", role: "Frontend Developer", email: "john@example.com", phone: "+1 (555) 000-0000" },
      summary: "Experienced software engineer dedicated to building scalable web applications.",
      skills: ["React", "JavaScript", "Node.js"],
      experience: [{ title: "Software Developer", company: "Tech Inc", duration: "2021 - Present", desc: "Built core product modules." }],
      education: [{ degree: "B.S. in Computer Science", institution: "University", tenure: "2017 - 2021" }],
      projects: [{ title: "SaaS Application", technology: "React, Node.js", desc: "Built fullstack web application." }],
      certifications: ["Certified Developer"]
    }, null, 2)
  });

  const fetchAll = async () => {
    setLoading(true);
    const data = await getExamples();
    setExamples(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Business',
      industry: 'Business Operations',
      experienceLevel: '2-5 Years',
      template: 'modern',
      previewImage: '',
      atsScore: 95,
      description: '',
      isFeatured: false,
      isPremium: false,
      jsonString: JSON.stringify({
        personalInfo: { fullName: "John Smith", role: "Software Engineer", email: "john@example.com" },
        summary: "Professional summary here...",
        skills: ["React", "Node.js"],
        experience: [],
        education: [],
        projects: []
      }, null, 2)
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (ex) => {
    setEditingId(ex._id || ex.id);
    setFormData({
      title: ex.title || '',
      category: ex.category || 'Business',
      industry: ex.industry || 'Business Operations',
      experienceLevel: ex.experienceLevel || '2-5 Years',
      template: ex.template || 'modern',
      previewImage: ex.previewImage || '',
      atsScore: ex.atsScore || 95,
      description: ex.description || '',
      isFeatured: ex.isFeatured || false,
      isPremium: ex.isPremium || false,
      jsonString: JSON.stringify(ex.resumeData || {}, null, 2)
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadPreviewImage(file);
      if (res.success && res.url) {
        setFormData(prev => ({ ...prev, previewImage: res.url }));
        alert('Image uploaded to Cloudinary successfully! 🎉');
      }
    } catch (err) {
      alert('Cloudinary upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let parsedResumeData = {};
      try {
        parsedResumeData = JSON.parse(formData.jsonString);
      } catch (pErr) {
        alert('Invalid Resume JSON structure. Please fix JSON syntax.');
        return;
      }

      const payload = {
        title: formData.title,
        category: formData.category,
        industry: formData.industry,
        experienceLevel: formData.experienceLevel,
        template: formData.template,
        previewImage: formData.previewImage,
        atsScore: Number(formData.atsScore),
        description: formData.description,
        isFeatured: Boolean(formData.isFeatured),
        isPremium: Boolean(formData.isPremium),
        resumeData: parsedResumeData
      };

      if (editingId) {
        await updateExample(editingId, payload);
        alert('Resume Example updated successfully!');
      } else {
        await createExample(payload);
        alert('New Resume Example created successfully!');
      }

      setShowModal(false);
      fetchAll();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteExample(id);
        alert('Resume Example deleted.');
        fetchAll();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  const filteredExamples = examples.filter(ex => 
    (ex.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ex.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '0.25rem' }}>
              ADMIN MANAGEMENT PANEL
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Resume Examples Management
            </h1>
            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              Manage, upload Cloudinary preview images, and edit templates in MongoDB.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '24px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
            }}
          >
            <Plus size={18} /> Add Resume Example
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search examples by title or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.8rem',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              outline: 'none',
              background: 'white',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Examples Table */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 900, letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Preview</th>
                <th style={{ padding: '1rem 1.25rem' }}>Title</th>
                <th style={{ padding: '1rem 1.25rem' }}>Category</th>
                <th style={{ padding: '1rem 1.25rem' }}>Template</th>
                <th style={{ padding: '1rem 1.25rem' }}>ATS Score</th>
                <th style={{ padding: '1rem 1.25rem' }}>Flags</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExamples.map((ex) => (
                <tr key={ex._id || ex.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.88rem' }}>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    {ex.previewImage ? (
                      <img src={ex.previewImage} alt={ex.title} style={{ width: '40px', height: '52px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    ) : (
                      <div style={{ width: '40px', height: '52px', background: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <ImageIcon size={18} />
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {ex.title}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#475569' }}>
                    <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {ex.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#64748b', textTransform: 'capitalize' }}>
                    {ex.template || 'modern'}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#059669', fontWeight: 900 }}>
                    {ex.atsScore || 95}/100
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {ex.isFeatured && <span style={{ background: '#fef3c7', color: '#d97706', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>Featured</span>}
                      {ex.isPremium && <span style={{ background: '#f3e8ff', color: '#7e22ce', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>PRO</span>}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenEditModal(ex)}
                        style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', color: '#0284c7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700 }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ex._id || ex.id, ex.title)}
                        style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #fca5a5', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700 }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add / Edit Form Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
                {editingId ? 'Edit Resume Example' : 'Add New Resume Example'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Resume Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend Developer"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  >
                    <option value="Business">Business</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineering"
                    value={formData.industry}
                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Experience Level</label>
                  <input
                    type="text"
                    placeholder="e.g. 2-5 Years"
                    value={formData.experienceLevel}
                    onChange={e => setFormData({ ...formData, experienceLevel: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Template Design</label>
                  <select
                    value={formData.template}
                    onChange={e => setFormData({ ...formData, template: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  >
                    <option value="modern">Modern</option>
                    <option value="professional">Professional</option>
                    <option value="executive">Executive</option>
                    <option value="creative">Creative</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              </div>

              {/* Cloudinary Preview Image Upload */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Cloudinary Preview Image URL
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="https://res.cloudinary.com/..."
                    value={formData.previewImage}
                    onChange={e => setFormData({ ...formData, previewImage: e.target.value })}
                    style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                  <label style={{ padding: '0.6rem 1rem', background: '#e0f2fe', color: '#0284c7', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Upload size={14} /> {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Description</label>
                <input
                  type="text"
                  placeholder="Short description of this resume template..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* Resume Data JSON Editor */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Resume Data Structure (JSON)
                </label>
                <textarea
                  rows={8}
                  value={formData.jsonString}
                  onChange={e => setFormData({ ...formData, jsonString: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* Flags */}
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  Featured Example
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isPremium}
                    onChange={e => setFormData({ ...formData, isPremium: e.target.checked })}
                  />
                  Premium Template
                </label>
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.65rem 1.75rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(2,132,199,0.25)' }}
                >
                  {editingId ? 'Save Changes' : 'Create Example'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResumeExamples;
