import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';

const AdminTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [form, setForm] = useState({
    _id: '',
    category: 'Information Technology',
    jobTitle: '',
    template: 'Modern',
    atsScore: 90,
    premium: false,
    resumeJsonText: ''
  });

  const categoriesList = [
    'Information Technology', 'Business', 'Engineering', 'Healthcare',
    'Finance', 'Education', 'Design', 'Marketing', 'Sales',
    'Hospitality', 'Government', 'Legal', 'Human Resources', 'Manufacturing'
  ];

  const templateStyles = ['Modern', 'Professional', 'Minimal', 'Executive', 'Creative', 'Corporate', 'Classic'];

  const fetchTemplates = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/templates');
      const data = await res.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleEdit = (tpl) => {
    setForm({
      _id: tpl._id,
      category: tpl.category,
      jobTitle: tpl.jobTitle,
      template: tpl.template,
      atsScore: tpl.atsScore,
      premium: tpl.premium,
      resumeJsonText: JSON.stringify(tpl.resumeJson, null, 2)
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/templates/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        alert('Template deleted successfully!');
        fetchTemplates();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let parsedJson = {};
    try {
      if (form.resumeJsonText.trim()) {
        parsedJson = JSON.parse(form.resumeJsonText);
      }
    } catch (err) {
      alert('Invalid JSON layout structure. Please check formatting!');
      return;
    }

    const payload = {
      category: form.category,
      jobTitle: form.jobTitle,
      template: form.template,
      atsScore: form.atsScore,
      premium: form.premium,
      resumeJson: parsedJson
    };

    const isEdit = !!form._id;
    const url = isEdit 
      ? `http://localhost:5000/api/templates/${form._id}` 
      : 'http://localhost:5000/api/templates';
      
    try {
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert(isEdit ? 'Template updated!' : 'Template created!');
        setForm({
          _id: '',
          category: 'Information Technology',
          jobTitle: '',
          template: 'Modern',
          atsScore: 90,
          premium: false,
          resumeJsonText: ''
        });
        fetchTemplates();
      } else {
        alert('Operation failed: ' + data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '5rem', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '3rem auto 0', padding: '0 1.5rem' }}>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '2rem' }}>
          Resume Template Management (Admin)
        </h1>

        <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Left Column: Form Panel */}
          <form onSubmit={handleSubmit} style={{
            flex: 1.2,
            minWidth: '320px',
            background: 'white',
            borderRadius: '24px',
            border: '2px solid #e2e8f0',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
              {form._id ? 'Edit Template Layout' : 'Create New Template Layout'}
            </h2>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Job Title</label>
                <input
                  type="text"
                  required
                  value={form.jobTitle}
                  onChange={e => setForm({ ...form, jobTitle: e.target.value })}
                  placeholder="e.g. React Developer"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', background: 'white', outline: 'none' }}
                >
                  {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Template Style</label>
                <select
                  value={form.template}
                  onChange={e => setForm({ ...form, template: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', background: 'white', outline: 'none' }}
                >
                  {templateStyles.map(sty => <option key={sty} value={sty}>{sty}</option>)}
                </select>
              </div>

              <div style={{ width: '120px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>ATS Score</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={form.atsScore}
                  onChange={e => setForm({ ...form, atsScore: parseInt(e.target.value) || 90 })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
                <input
                  type="checkbox"
                  id="premium"
                  checked={form.premium}
                  onChange={e => setForm({ ...form, premium: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="premium" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>Premium</label>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Resume JSON Configuration (Optional)</label>
              <textarea
                value={form.resumeJsonText}
                onChange={e => setForm({ ...form, resumeJsonText: e.target.value })}
                placeholder="Paste JSON layouts here. Leave empty to automatically generate default professional objective, education and work sections."
                rows="8"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', fontFamily: 'monospace', fontSize: '0.8rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" style={{ flex: 1, background: '#0056b8', color: 'white', border: 'none', borderRadius: '10px', padding: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>
                {form._id ? 'Update Template' : 'Create Template'}
              </button>
              {form._id && (
                <button type="button" onClick={() => setForm({ _id: '', category: 'Information Technology', jobTitle: '', template: 'Modern', atsScore: 90, premium: false, resumeJsonText: '' })} style={{ background: '#64748b', color: 'white', border: 'none', borderRadius: '10px', padding: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Right Column: Template List View */}
          <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Active Templates Catalog ({templates.length})</h2>

            {loading ? (
              <div style={{ color: '#64748b', fontWeight: 650 }}>Loading catalog...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '580px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {templates.map(tpl => (
                  <div
                    key={tpl._id}
                    style={{
                      background: 'white',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.2rem' }}>{tpl.jobTitle}</h4>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>{tpl.category}</span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0056b8', background: '#eff6ff', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>{tpl.template}</span>
                        {tpl.premium && <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#b45309', background: '#fffbeb', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>Premium</span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleEdit(tpl)}
                        style={{ background: '#eff6ff', color: '#0056b8', border: 'none', borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tpl._id)}
                        style={{ background: '#fff1f2', color: '#f43f5e', border: 'none', borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminTemplates;
