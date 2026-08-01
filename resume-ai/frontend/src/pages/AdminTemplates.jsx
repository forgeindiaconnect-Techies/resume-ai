import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';

const AdminTemplates = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [roles, setRoles] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [sections, setSections] = useState([]);

  // Selections
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  // Form States
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: '💻' });
  const [roleForm, setRoleForm] = useState({ categoryId: '', title: '' });
  const [templateForm, setTemplateForm] = useState({ jobRoleId: '', templateName: '', layout: 'modern-blue', premium: false });
  const [sectionForm, setSectionForm] = useState({ templateId: '', section: '', order: 1 });

  // Fetching Helpers
  const fetchAll = async () => {
    try {
      const resCat = await fetch('http://localhost:5000/api/admin/categories');
      const dataCat = await resCat.json();
      if (dataCat.success) setCategories(dataCat.data);

      const resRoles = await fetch('http://localhost:5000/api/admin/job-roles');
      const dataRoles = await resRoles.json();
      if (dataRoles.success) setRoles(dataRoles.data);

      const resTpl = await fetch('http://localhost:5000/api/admin/templates');
      const dataTpl = await resTpl.json();
      if (dataTpl.success) setTemplates(dataTpl.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Fetch sections when template selection changes
  useEffect(() => {
    if (!selectedTemplateId) {
      setSections([]);
      return;
    }
    const fetchSections = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/sections?templateId=${selectedTemplateId}`);
        const data = await res.json();
        if (data.success) setSections(data.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSections();
  }, [selectedTemplateId]);

  // CRUD Submissions
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      const data = await res.json();
      if (data.success) {
        alert('Category added successfully!');
        setCategoryForm({ name: '', icon: '💻' });
        fetchAll();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Delete category? This will clear all linked job roles too.')) return;
    await fetch(`http://localhost:5000/api/admin/categories/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (!roleForm.categoryId) {
      alert('Please select a Category!');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/admin/job-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleForm)
      });
      const data = await res.json();
      if (data.success) {
        alert('Job Role created!');
        setRoleForm({ categoryId: '', title: '' });
        fetchAll();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoleDelete = async (id) => {
    if (!window.confirm('Delete role?')) return;
    await fetch(`http://localhost:5000/api/admin/job-roles/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const handleTemplateSubmit = async (e) => {
    e.preventDefault();
    if (!templateForm.jobRoleId) {
      alert('Please select a Job Role!');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateForm)
      });
      const data = await res.json();
      if (data.success) {
        alert('Resume template created!');
        setTemplateForm({ jobRoleId: '', templateName: '', layout: 'modern-blue', premium: false });
        fetchAll();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTemplateDelete = async (id) => {
    if (!window.confirm('Delete template?')) return;
    await fetch(`http://localhost:5000/api/admin/templates/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTemplateId) {
      alert('Please select a Template first!');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sectionForm, templateId: selectedTemplateId })
      });
      const data = await res.json();
      if (data.success) {
        alert('Section order registered!');
        setSectionForm({ templateId: '', section: '', order: sections.length + 2 });
        // Refresh active sections list
        const resSec = await fetch(`http://localhost:5000/api/admin/sections?templateId=${selectedTemplateId}`);
        const dataSec = await resSec.json();
        if (dataSec.success) setSections(dataSec.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSectionDelete = async (id) => {
    await fetch(`http://localhost:5000/api/admin/sections/${id}`, { method: 'DELETE' });
    // Refresh sections list
    const resSec = await fetch(`http://localhost:5000/api/admin/sections?templateId=${selectedTemplateId}`);
    const dataSec = await resSec.json();
    if (dataSec.success) setSections(dataSec.data);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '6rem', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '3rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem' }}>
            SaaS Template Manager
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Dynamically add new categories, job roles, layouts, and step sections without manual database edits.
          </p>
        </div>

        {/* Tab Selector buttons */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
          {['categories', 'job-roles', 'templates', 'resume-sections'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab ? '#0056b8' : 'transparent',
                color: activeTab === tab ? 'white' : '#64748b',
                fontWeight: 800,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {/* Form */}
            <form onSubmit={handleCategorySubmit} style={{ flex: 1, minWidth: '320px', background: 'white', border: '1.5px solid #e2e8f0', padding: '2rem', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>Add Category</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Category Name</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none' }}
                    placeholder="e.g. Information Technology"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Icon (Emoji / Text)</label>
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none' }}
                  />
                </div>
                <button type="submit" style={{ background: '#0056b8', color: 'white', border: 'none', borderRadius: '10px', padding: '0.8rem', fontWeight: 850, cursor: 'pointer', marginTop: '0.5rem' }}>
                  Save Category
                </button>
              </div>
            </form>

            {/* List */}
            <div style={{ flex: 1.5, minWidth: '320px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>Current Categories</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {categories.map(cat => (
                  <div key={cat._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1.5px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>{cat.name}</span>
                    </div>
                    <button onClick={() => handleCategoryDelete(cat._id)} style={{ background: '#fff1f2', color: '#f43f5e', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Job Roles Tab */}
        {activeTab === 'job-roles' && (
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <form onSubmit={handleRoleSubmit} style={{ flex: 1, minWidth: '320px', background: 'white', border: '1.5px solid #e2e8f0', padding: '2rem', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>Add Job Role</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Select Category</label>
                  <select
                    value={roleForm.categoryId}
                    onChange={e => setRoleForm({ ...roleForm, categoryId: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', background: 'white' }}
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Job Title</label>
                  <input
                    type="text"
                    required
                    value={roleForm.title}
                    onChange={e => setRoleForm({ ...roleForm, title: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none' }}
                    placeholder="e.g. React Developer"
                  />
                </div>
                <button type="submit" style={{ background: '#0056b8', color: 'white', border: 'none', borderRadius: '10px', padding: '0.8rem', fontWeight: 850, cursor: 'pointer', marginTop: '0.5rem' }}>
                  Save Job Role
                </button>
              </div>
            </form>

            <div style={{ flex: 1.5, minWidth: '320px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>Job Roles</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
                {roles.map(role => (
                  <div key={role._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1.5px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '16px' }}>
                    <div>
                      <span style={{ fontWeight: 800, color: '#0f172a', display: 'block' }}>{role.title}</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 650 }}>Slug: {role.slug} &bull; Cat: {role.categoryId?.name}</span>
                    </div>
                    <button onClick={() => handleRoleDelete(role._id)} style={{ background: '#fff1f2', color: '#f43f5e', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <form onSubmit={handleTemplateSubmit} style={{ flex: 1, minWidth: '320px', background: 'white', border: '1.5px solid #e2e8f0', padding: '2rem', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>Create Layout Template</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Select Job Role</label>
                  <select
                    value={templateForm.jobRoleId}
                    onChange={e => setTemplateForm({ ...templateForm, jobRoleId: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', background: 'white' }}
                  >
                    <option value="">-- Choose Job Role --</option>
                    {roles.map(r => <option key={r._id} value={r._id}>{r.title} ({r.categoryId?.name})</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Template Name</label>
                  <input
                    type="text"
                    required
                    value={templateForm.templateName}
                    onChange={e => setTemplateForm({ ...templateForm, templateName: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none' }}
                    placeholder="e.g. Modern Blue"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Layout Theme ID</label>
                  <select
                    value={templateForm.layout}
                    onChange={e => setTemplateForm({ ...templateForm, layout: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', background: 'white' }}
                  >
                    <option value="modern-blue">Modern Blue</option>
                    <option value="professional-dark">Professional Dark</option>
                    <option value="creative-pink">Creative Pink</option>
                    <option value="minimalist-grey">Minimalist Grey</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="tpl-premium"
                    checked={templateForm.premium}
                    onChange={e => setTemplateForm({ ...templateForm, premium: e.target.checked })}
                  />
                  <label htmlFor="tpl-premium" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Premium Template</label>
                </div>
                <button type="submit" style={{ background: '#0056b8', color: 'white', border: 'none', borderRadius: '10px', padding: '0.8rem', fontWeight: 850, cursor: 'pointer', marginTop: '0.5rem' }}>
                  Save Template
                </button>
              </div>
            </form>

            <div style={{ flex: 1.5, minWidth: '320px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>Active Templates</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {templates.map(tpl => (
                  <div key={tpl._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1.5px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '16px' }}>
                    <div>
                      <span style={{ fontWeight: 800, color: '#0f172a', display: 'block' }}>{tpl.templateName}</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 650 }}>Role: {tpl.jobRoleId?.title} &bull; Layout: {tpl.layout}</span>
                    </div>
                    <button onClick={() => handleTemplateDelete(tpl._id)} style={{ background: '#fff1f2', color: '#f43f5e', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resume Sections Tab */}
        {activeTab === 'resume-sections' && (
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Select Target Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={e => setSelectedTemplateId(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', background: 'white' }}
                >
                  <option value="">-- Choose Template --</option>
                  {templates.map(t => <option key={t._id} value={t._id}>{t.templateName} ({t.jobRoleId?.title})</option>)}
                </select>
              </div>

              {selectedTemplateId && (
                <form onSubmit={handleSectionSubmit} style={{ background: 'white', border: '1.5px solid #e2e8f0', padding: '2rem', borderRadius: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>Add Step Section</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Section Title</label>
                      <input
                        type="text"
                        required
                        value={sectionForm.section}
                        onChange={e => setSectionForm({ ...sectionForm, section: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none' }}
                        placeholder="e.g. Summary, Skills, Experience"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Display Order (Weight)</label>
                      <input
                        type="number"
                        required
                        value={sectionForm.order}
                        onChange={e => setSectionForm({ ...sectionForm, order: parseInt(e.target.value) || 1 })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none' }}
                      />
                    </div>
                    <button type="submit" style={{ background: '#0056b8', color: 'white', border: 'none', borderRadius: '10px', padding: '0.8rem', fontWeight: 850, cursor: 'pointer' }}>
                      Add Section
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div style={{ flex: 1.5, minWidth: '320px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>Configured Sections</h3>
              {!selectedTemplateId ? (
                <div style={{ color: '#64748b', fontStyle: 'italic' }}>Please select a template from the dropdown to manage dynamic builder sections.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {sections.map(sec => (
                    <div key={sec._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1.5px solid #e2e8f0', padding: '0.75rem 1.25rem', borderRadius: '12px' }}>
                      <div>
                        <span style={{ fontWeight: 850, color: '#0f172a' }}>{sec.section}</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '0.5rem' }}>Order: {sec.order}</span>
                      </div>
                      <button onClick={() => handleSectionDelete(sec._id)} style={{ background: '#fff1f2', color: '#f43f5e', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', fontWeight: 800, cursor: 'pointer', fontSize: '0.7rem' }}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTemplates;
