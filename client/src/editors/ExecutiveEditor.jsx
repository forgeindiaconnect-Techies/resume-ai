import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ExecutiveLayout from '../components/layouts/ExecutiveLayout';
import {
  Field, TextArea, SectionHeader, AddButton, ItemCard, Grid2,
  SkillTagInput, EditorShell, SectionReorderControl, loadSession, saveSession
} from './editorUtils';
import SignatureModal from '../components/common/SignatureModal';
import QrScanUploadSection from '../components/common/QrScanUploadSection';

const buildFromSession = (session) => ({
  title: session.title || 'Executive Resume',
  templateId: 'executive',
  personalInfo: {
    name: session.personalInfo?.name || session.personalInfo?.fullName || session.name || 'Vikramaditya Singhania',
    role: session.personalInfo?.role || session.role || 'Chief Financial Officer (CFO)',
    email: session.personalInfo?.email || session.email || 'v.singhania@forgeindiaconnect.com',
    phone: session.personalInfo?.phone || session.phone || '+91 99100 55443',
    location: session.personalInfo?.location || session.location || 'Mumbai, Maharashtra',
    linkedin: session.personalInfo?.linkedin || session.linkedin || 'linkedin.com/in/vikramaditya-singhania-cfo',
  },
  summary: session.personalInfo?.summary || session.summary || session.objective || '',
  competencies: [
    ...(session.skills?.programming || []),
    ...(session.skills?.frameworks || []),
    ...(session.skills?.databases || [])
  ].filter(Boolean),
  experience: (session.experience || []).map((e, i) => ({
    id: i + 1,
    title: e.title || e.role || '',
    company: e.company || '',
    duration: e.duration || '',
    desc: e.desc || '',
  })),
  education: (session.education || []).map((e, i) => ({
    id: i + 1,
    degree: e.degree || '',
    institution: e.institution || e.school || '',
    tenure: e.tenure || '',
  })),
  certifications: (session.certificates || []).map(c => c.name || c.title || '').filter(Boolean),
  achievements: (session.achievements || []).map((a, i) => ({ id: i + 1, title: a.title || '', desc: a.desc || a.description || '' })),
  languagesList: (session.languagesList || []).map((l, i) => ({ id: i + 1, name: l.name || '', level: l.level || '' })),
  signature: session.signature || { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' },
  references: 'Available upon request.',
});

const defaultData = () => ({
  title: 'Executive Resume',
  templateId: 'executive',
  personalInfo: {
    name: 'Vikramaditya Singhania',
    role: 'Chief Financial Officer (CFO)',
    email: 'v.singhania@forgeindiaconnect.com',
    phone: '+91 99100 55443',
    location: 'Mumbai, Maharashtra',
    linkedin: 'linkedin.com/in/vikramaditya-singhania-cfo',
  },
  summary: 'Senior Finance Executive and Chartered Accountant (FCA) with 17+ years leading corporate finance, investor relations, and multi-hundred-crore M&A transactions. Guided enterprise growth from ₹80 Cr to ₹950 Cr annual revenue.',
  competencies: ['Corporate Finance', 'M&A Strategy', 'P&L Management', 'SEBI / RBI Compliance', 'Treasury & Risk'],
  experience: [
    { id: 1, title: 'Chief Executive Officer', company: 'Global Enterprises Inc.', duration: '2019 – Present', desc: 'Drove 40% revenue growth in 3 years.\nLed global expansion into 5 new markets.\nBuilt and scaled executive leadership team from 8 to 24.' }
  ],
  education: [
    { id: 1, degree: 'MBA – Business Administration', institution: 'Harvard Business School', tenure: '2004 – 2006' }
  ],
  certifications: ['PMP – Project Management Professional', 'Six Sigma Black Belt'],
  achievements: [],
  languagesList: [],
  signature: { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' },
  references: 'Available upon request from senior board-level contacts.',
});

const ExecutiveEditor = () => {
  const { sessionId } = useParams();
  const [saveStatus, setSaveStatus] = useState('All changes saved ✔');
  const [accentColor, setAccentColor] = useState(() => {
    const session = loadSession(sessionId);
    return session?.color || '#0f172a';
  });
  const [fontFamily, setFontFamily] = useState(() => {
    const session = loadSession(sessionId);
    return session?.font || "'Inter', sans-serif";
  });
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [sections, setSections] = useState([
    { id: 'summary', title: 'Executive Summary', enabled: true },
    { id: 'experience', title: 'Work Experience', enabled: true },
    { id: 'competencies', title: 'Core Competencies', enabled: true },
    { id: 'education', title: 'Education', enabled: true },
    { id: 'certifications', title: 'Certifications', enabled: true },
    { id: 'achievements', title: 'Achievements', enabled: true },
    { id: 'languages', title: 'Languages', enabled: true },
    { id: 'references', title: 'References', enabled: true },
  ]);
  
  const [data, setData] = useState(() => {
    const session = loadSession(sessionId);
    return session ? buildFromSession(session) : defaultData();
  });

  useEffect(() => {
    setSaveStatus('Saving…');
    const t = setTimeout(() => { saveSession(sessionId, data); setSaveStatus('All changes saved ✔'); }, 900);
    return () => clearTimeout(t);
  }, [data, sessionId]);

  const setPersonal = (e) => setData(d => ({ ...d, personalInfo: { ...d.personalInfo, [e.target.name]: e.target.value } }));
  const addExp = () => setData(d => ({ ...d, experience: [...d.experience, { id: Date.now(), title: '', company: '', duration: '', desc: '' }] }));
  const delExp = (id) => setData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));
  const updExp = (id, f, v) => setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, [f]: v } : e) }));
  const addEdu = () => setData(d => ({ ...d, education: [...d.education, { id: Date.now(), degree: '', institution: '', tenure: '' }] }));
  const delEdu = (id) => setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));
  const updEdu = (id, f, v) => setData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, [f]: v } : e) }));
  const addComp = (sk) => setData(d => ({ ...d, competencies: [...d.competencies, sk] }));
  const removeComp = (i) => setData(d => ({ ...d, competencies: d.competencies.filter((_, idx) => idx !== i) }));
  const addCert = () => setData(d => ({ ...d, certifications: [...d.certifications, ''] }));
  const updCert = (i, val) => setData(d => ({ ...d, certifications: d.certifications.map((c, idx) => idx === i ? val : c) }));
  const delCert = (i) => setData(d => ({ ...d, certifications: d.certifications.filter((_, idx) => idx !== i) }));

  const previewData = {
    name: data.personalInfo.name,
    role: data.personalInfo.role,
    showQrCode: data.personalInfo.showQrCode !== false,
    qrTarget: data.personalInfo.qrTarget || 'linkedin',
    customQrImage: data.personalInfo.customQrImage || null,
    showRecruiterBadges: data.personalInfo.showRecruiterBadges === true,
    noticePeriod: data.personalInfo.noticePeriod || 'Immediate Joiner',
    totalExp: data.personalInfo.totalExp || '5+ Years',
    workPreference: data.personalInfo.workPreference || 'Hybrid',
    contact: { 
      email: data.personalInfo.email, 
      phone: data.personalInfo.phone, 
      location: data.personalInfo.location, 
      linkedin: data.personalInfo.linkedin,
      showQrCode: data.personalInfo.showQrCode !== false,
      qrTarget: data.personalInfo.qrTarget || 'linkedin',
      customQrImage: data.personalInfo.customQrImage || null,
      showRecruiterBadges: data.personalInfo.showRecruiterBadges === true,
      noticePeriod: data.personalInfo.noticePeriod || 'Immediate Joiner',
      totalExp: data.personalInfo.totalExp || '5+ Years',
      workPreference: data.personalInfo.workPreference || 'Hybrid'
    },
    objective: data.summary,
    skills: data.competencies,
    experience: data.experience.map(e => ({ title: e.title, company: e.company, duration: e.duration, desc: e.desc })),
    education: data.education.map(e => ({ degree: e.degree, institution: e.institution, tenure: e.tenure })),
    projects: [],
    training: data.certifications.map(c => ({ title: typeof c === 'string' ? c : c.name, org: c.org || '', year: c.year || '' })),
    certifications: data.certifications,
    languagesList: data.languagesList || [],
    achievements: data.achievements || [],
    signature: data.signature,
    references: data.references,
  };

  return (
    <EditorShell 
      accentColor={accentColor} 
      onColorChange={setAccentColor}
      fontFamily={fontFamily}
      onFontChange={setFontFamily}
      templateName="Executive" 
      templateEmoji="🏛" 
      onDownload={() => window.print()} 
      saveStatus={saveStatus}
      formData={data}
      onUpdateSkills={(newSkill) => {
        setData(d => ({
          ...d,
          competencies: Array.isArray(d.competencies)
            ? (d.competencies.some(s => s.toLowerCase() === newSkill.toLowerCase()) ? d.competencies : [...d.competencies, newSkill])
            : [newSkill]
        }));
      }}
      preview={<ExecutiveLayout data={previewData} sections={sections} role={data.personalInfo.role} customColor={accentColor} customFont={fontFamily} />}
    >
      <SectionReorderControl
        sections={sections}
        onReorder={setSections}
        onToggle={(id) => setSections(s => s.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x))}
        accent={accentColor}
      />

      <SectionHeader icon="👤" title="Personal Details" accent={accentColor} />
      <Field label="Full Name" name="name" value={data.personalInfo.name} onChange={setPersonal} accent={accentColor} placeholder="e.g. Alexander Wright" />
      <Field label="Professional Title" name="role" value={data.personalInfo.role} onChange={setPersonal} accent={accentColor} placeholder="e.g. Chief Executive Officer" />
      <Grid2>
        <Field label="Email" name="email" value={data.personalInfo.email} onChange={setPersonal} accent={accentColor} />
        <Field label="Phone" name="phone" value={data.personalInfo.phone} onChange={setPersonal} accent={accentColor} />
      </Grid2>
      <Grid2>
        <Field label="Location" name="location" value={data.personalInfo.location} onChange={setPersonal} accent={accentColor} />
        <Field label="LinkedIn" name="linkedin" value={data.personalInfo.linkedin} onChange={setPersonal} accent={accentColor} />
      </Grid2>

      {/* ─── Profile QR Code & Custom Image Upload ─── */}
      <QrScanUploadSection personalInfo={data.personalInfo} onChange={setPersonal} accentColor={accentColor} />

      <SectionHeader icon="📝" title="Executive Summary" accent={accentColor} />
      <TextArea label="Summary" value={data.summary} rows={6}
        onChange={e => setData(d => ({ ...d, summary: e.target.value }))} accent={accentColor}
        placeholder="Visionary leader with expertise in..." />

      <SectionHeader icon="⚡" title="Core Competencies & Leadership Skills" accent={accentColor} />
      <SkillTagInput label="Add competency and press Enter" skills={data.competencies} onAdd={addComp} onRemove={removeComp} accent={accentColor} placeholder="e.g. Strategic Leadership" />

      <SectionHeader icon="💼" title="Work Experience" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.experience.map((exp, idx) => (
          <ItemCard key={exp.id} onDelete={() => delExp(exp.id)} accent={accentColor} index={idx}>
            <Grid2>
              <Field label="Job Title" value={exp.title} onChange={e => updExp(exp.id, 'title', e.target.value)} accent={accentColor} />
              <Field label="Company" value={exp.company} onChange={e => updExp(exp.id, 'company', e.target.value)} accent={accentColor} />
            </Grid2>
            <Field label="Duration" value={exp.duration} onChange={e => updExp(exp.id, 'duration', e.target.value)} accent={accentColor} placeholder="2020 – Present" />
            <TextArea label="Key Achievements (one per line)" value={exp.desc} onChange={e => updExp(exp.id, 'desc', e.target.value)} accent={accentColor} rows={4} placeholder="• Led global expansion into 5 new markets&#10;• Grew revenue by 40%" />
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Work Experience" onClick={addExp} accent={accentColor} />

      <SectionHeader icon="🎓" title="Education" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.education.map((edu, idx) => (
          <ItemCard key={edu.id} onDelete={() => delEdu(edu.id)} accent={accentColor} index={idx}>
            <Field label="Degree / Qualification" value={edu.degree} onChange={e => updEdu(edu.id, 'degree', e.target.value)} accent={accentColor} />
            <Grid2>
              <Field label="Institution" value={edu.institution} onChange={e => updEdu(edu.id, 'institution', e.target.value)} accent={accentColor} />
              <Field label="Years" value={edu.tenure} onChange={e => updEdu(edu.id, 'tenure', e.target.value)} accent={accentColor} />
            </Grid2>
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Education" onClick={addEdu} accent={accentColor} />

      <SectionHeader icon="🏆" title="Certifications & Awards" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {data.certifications.map((cert, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Field label="" value={cert} onChange={e => updCert(i, e.target.value)} accent={accentColor} placeholder="e.g. PMP – Project Management Professional" />
            <button onClick={() => delCert(i)} style={{ background: '#fee2e2', border: 'none', color: '#ef4444', width: 32, height: 32, borderRadius: '6px', cursor: 'pointer', fontWeight: 900, flexShrink: 0, fontSize: '1rem' }}>×</button>
          </div>
        ))}
      </div>
      <AddButton label="+ Add Certification" onClick={addCert} accent={accentColor} />

      <SectionHeader icon="🏆" title="Key Achievements" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(data.achievements || []).map((ach, idx) => (
          <ItemCard key={ach.id} onDelete={() => setData(d => ({ ...d, achievements: d.achievements.filter(a => a.id !== ach.id) }))} accent={accentColor} index={idx}>
            <Field label="Achievement Title" value={ach.title} onChange={e => setData(d => ({ ...d, achievements: d.achievements.map(a => a.id === ach.id ? { ...a, title: e.target.value } : a) }))} accent={accentColor} placeholder="e.g. Led $400M P&L turnaround" />
            <TextArea label="Details" value={ach.desc} onChange={e => setData(d => ({ ...d, achievements: d.achievements.map(a => a.id === ach.id ? { ...a, desc: e.target.value } : a) }))} accent={accentColor} rows={2} />
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Achievement" onClick={() => setData(d => ({ ...d, achievements: [...(d.achievements || []), { id: Date.now(), title: '', desc: '' }] }))} accent={accentColor} />

      <SectionHeader icon="🌐" title="Languages" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(data.languagesList || []).map((lang, idx) => (
          <ItemCard key={lang.id} onDelete={() => setData(d => ({ ...d, languagesList: d.languagesList.filter(l => l.id !== lang.id) }))} accent={accentColor} index={idx}>
            <Grid2>
              <Field label="Language" value={lang.name} onChange={e => setData(d => ({ ...d, languagesList: d.languagesList.map(l => l.id === lang.id ? { ...l, name: e.target.value } : l) }))} accent={accentColor} placeholder="e.g. English" />
              <Field label="Proficiency" value={lang.level} onChange={e => setData(d => ({ ...d, languagesList: d.languagesList.map(l => l.id === lang.id ? { ...l, level: e.target.value } : l) }))} accent={accentColor} placeholder="e.g. Native" />
            </Grid2>
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Language" onClick={() => setData(d => ({ ...d, languagesList: [...(d.languagesList || []), { id: Date.now(), name: '', level: '' }] }))} accent={accentColor} />

      <div style={{ height: '1rem' }} />
      <SectionHeader icon="✍️" title="Signature" accent={accentColor} />
      <AddButton label="Add Signature" onClick={() => setIsSignatureModalOpen(true)} accent={accentColor} />
      
      <SectionHeader icon="📋" title="References" accent={accentColor} />
      <TextArea label="References Note" value={data.references} rows={2}
        onChange={e => setData(d => ({ ...d, references: e.target.value }))} accent={accentColor} />

      <div style={{ height: '2rem' }} />

      <SignatureModal 
        isOpen={isSignatureModalOpen} 
        onClose={() => setIsSignatureModalOpen(false)} 
        signature={data.signature} 
        onSave={(sig) => setData(d => ({ ...d, signature: sig }))} 
        accentColor={accentColor} 
      />
    </EditorShell>
  );
};

export default ExecutiveEditor;
