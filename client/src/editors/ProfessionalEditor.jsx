import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfessionalLayout from '../components/layouts/ProfessionalLayout';
import {
  Field, TextArea, SectionHeader, AddButton, ItemCard, Grid2,
  SkillTagInput, EditorShell, SectionReorderControl, loadSession, saveSession
} from './editorUtils';
import SignatureModal from '../components/common/SignatureModal';
import QrScanUploadSection from '../components/common/QrScanUploadSection';

const defaultData = () => ({
  title: 'Professional Resume',
  templateId: 'professional',
  personalInfo: {
    name: 'Arjun Mehta',
    role: 'Senior Full Stack & Cloud Architect',
    email: 'arjun.mehta@forgeindiaconnect.com',
    phone: '+91 98201 88776',
    location: 'Hyderabad, Telangana',
    linkedin: 'linkedin.com/in/arjun-mehta-dev',
  },
  summary: 'Senior Full Stack & Cloud Architect with 8+ years developing distributed microservices, scalable React applications, and high-concurrency cloud infrastructure for top Indian enterprises.',
  skills: ['React.js', 'Node.js', 'TypeScript', 'AWS Cloud', 'Kubernetes', 'Microservices', 'Docker', 'PostgreSQL'],
  experience: [
    { id: 1, role: 'Senior Cloud Architect', company: 'Reliance Jio Platforms', duration: '2021 – Present', desc: '• Architected resilient 5G core telemetry microservices handling 250k events/second with 99.999% uptime.\n• Decreased cloud computing costs by ₹65 Lakhs annually via Kubernetes auto-scaling.' },
    { id: 2, role: 'Senior Full Stack Engineer', company: 'Infosys Limited', duration: '2017 – 2021', desc: '• Led 14 engineers building cloud-native banking portals in React, Node.js, and TypeScript.\n• Optimized API response latency from 420ms to 65ms.' }
  ],
  education: [
    { id: 1, degree: 'B.Tech in Computer Science & Engineering', institution: 'Indian Institute of Technology (IIT) Bombay', tenure: '2013 – 2017' }
  ],
  certifications: [
    { id: 1, name: 'AWS Certified Solutions Architect – Professional', org: 'Amazon Web Services', year: '2023' },
    { id: 2, name: 'Certified Kubernetes Administrator (CKA)', org: 'Linux Foundation', year: '2022' }
  ],
  languages: ['English (Fluent)', 'Hindi (Native)', 'Telugu (Conversational)'],
  languagesList: [
    { id: 1, name: 'English', level: 'Fluent' },
    { id: 2, name: 'Hindi', level: 'Native' },
    { id: 3, name: 'Telugu', level: 'Conversational' }
  ],
  achievements: [
    { id: 1, title: 'National Tech Excellence Award', desc: 'Recognized for building sub-second UPI microservice scaling to 10M daily active users.' }
  ],
  signature: { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' },
  settings: {
    color: '#14532d',
    fontFamily: "'Inter', sans-serif",
    headingSize: 24,
    bodySize: 14,
    layoutMode: 'left-sidebar',
    spacingDensity: 'normal'
  },
});

const ProfessionalEditor = () => {
  const { sessionId } = useParams();
  const [saveStatus, setSaveStatus] = useState('All changes saved ✔');
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [sections, setSections] = useState([
    { id: 'summary', title: 'Summary', enabled: true },
    { id: 'experience', title: 'Experience', enabled: true },
    { id: 'education', title: 'Education', enabled: true },
    { id: 'skills', title: 'Skills', enabled: true },
    { id: 'certifications', title: 'Certifications', enabled: true },
    { id: 'achievements', title: 'Achievements', enabled: true },
    { id: 'languages', title: 'Languages', enabled: true },
  ]);
  
  const [data, setData] = useState(() => {
    const session = loadSession(sessionId);
    if (session) {
      return {
        title: session.title || 'Professional Resume',
        templateId: 'professional',
        personalInfo: {
          name: session.personalInfo?.name || session.personalInfo?.fullName || session.name || 'Arjun Mehta',
          role: session.personalInfo?.role || session.role || 'Senior Full Stack & Cloud Architect',
          email: session.personalInfo?.email || session.email || 'arjun.mehta@forgeindiaconnect.com',
          phone: session.personalInfo?.phone || session.phone || '+91 98201 88776',
          location: session.personalInfo?.location || session.location || 'Hyderabad, Telangana',
          linkedin: session.personalInfo?.linkedin || session.linkedin || 'linkedin.com/in/arjun-mehta-dev',
        },
        summary: session.personalInfo?.summary || session.summary || session.objective || '',
        skills: [
          ...(session.skills?.programming || []),
          ...(session.skills?.frameworks || []),
          ...(session.skills?.databases || []),
        ].filter(Boolean),
        experience: (session.experience || []).map((e, i) => ({
          id: i + 1,
          role: e.title || e.role || '',
          company: e.company || '',
          duration: e.duration || '',
          desc: e.desc || '',
        })),
        education: (session.education || []).map((e, i) => ({
          id: i + 1,
          degree: e.degree || '',
          institution: e.institution || '',
          tenure: e.tenure || '',
        })),
        certifications: (session.certificates || []).map((c, i) => ({ id: i + 1, name: c.name || c.title || '', org: c.organization || c.org || '', year: c.year || '' })),
        languages: (session.languagesList || []).map(l => `${l.name}${l.level ? ' (' + l.level + ')' : ''}`).filter(Boolean),
        achievements: (session.achievements || []).map((a, i) => ({ id: i + 1, title: a.title || '', desc: a.desc || a.description || '' })),
        languagesList: (session.languagesList || []).map((l, i) => ({ id: i + 1, name: l.name || '', level: l.level || '' })),
        signature: session.signature || { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' },
        settings: session.settings || {
          color: session.color || '#0369a1',
          fontFamily: session.font || "'Inter', sans-serif",
          headingSize: 24,
          bodySize: 14,
          layoutMode: 'left-sidebar',
          spacingDensity: 'normal'
        },
      };
    }
    return defaultData();
  });

  useEffect(() => {
    setSaveStatus('Saving…');
    const t = setTimeout(() => { saveSession(sessionId, data); setSaveStatus('All changes saved ✔'); }, 900);
    return () => clearTimeout(t);
  }, [data, sessionId]);

  const setPersonal = (e) => setData(d => ({ ...d, personalInfo: { ...d.personalInfo, [e.target.name]: e.target.value } }));
  const addSkill = (sk) => setData(d => ({ ...d, skills: [...d.skills, sk] }));
  const removeSkill = (i) => setData(d => ({ ...d, skills: d.skills.filter((_, idx) => idx !== i) }));
  const addLang = (sk) => setData(d => ({ ...d, languages: [...d.languages, sk] }));
  const removeLang = (i) => setData(d => ({ ...d, languages: d.languages.filter((_, idx) => idx !== i) }));
  const addExp = () => setData(d => ({ ...d, experience: [...d.experience, { id: Date.now(), role: '', company: '', duration: '', desc: '' }] }));
  const delExp = (id) => setData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));
  const updExp = (id, field, val) => setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, [field]: val } : e) }));
  const addEdu = () => setData(d => ({ ...d, education: [...d.education, { id: Date.now(), degree: '', institution: '', tenure: '' }] }));
  const delEdu = (id) => setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));
  const updEdu = (id, field, val) => setData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, [field]: val } : e) }));
  const addCert = () => setData(d => ({ ...d, certifications: [...d.certifications, { id: Date.now(), name: '', org: '', year: '' }] }));
  const delCert = (id) => setData(d => ({ ...d, certifications: d.certifications.filter(c => c.id !== id) }));
  const updCert = (id, field, val) => setData(d => ({ ...d, certifications: d.certifications.map(c => c.id === id ? { ...c, [field]: val } : c) }));
  const updateSettings = (newSettings) => setData(d => ({ ...d, settings: newSettings }));

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
    skills: data.skills,
    experience: data.experience.map(e => ({ title: e.role, company: e.company, duration: e.duration, desc: e.desc })),
    education: data.education.map(e => ({ degree: e.degree, institution: e.institution, tenure: e.tenure })),
    projects: [],
    training: data.certifications.map(c => ({ title: c.name, org: c.org, year: c.year })),
    certifications: data.certifications,
    languagesList: data.languages,
    achievements: data.achievements || [],
    signature: data.signature,
  };

  const accentColor = data.settings?.color || '#0369a1';
  const fontFamily = data.settings?.fontFamily || "'Inter', sans-serif";

  return (
    <EditorShell 
      accentColor={accentColor} 
      onColorChange={(color) => updateSettings({ ...data.settings, color })}
      fontFamily={fontFamily}
      onFontChange={(fontFamily) => updateSettings({ ...data.settings, fontFamily })}
      settings={data.settings}
      onSettingsChange={updateSettings}
      templateId={data.templateId}
      onTemplateChange={(id) => setData(d => ({ ...d, templateId: id }))}
      templateName="Professional" 
      templateEmoji="📋" 
      onDownload={() => window.print()} 
      saveStatus={saveStatus}
      formData={data}
      onUpdateSkills={(newSkill) => {
        setData(d => ({
          ...d,
          skills: Array.isArray(d.skills) 
            ? (d.skills.some(s => s.toLowerCase() === newSkill.toLowerCase()) ? d.skills : [...d.skills, newSkill])
            : [newSkill]
        }));
      }}
      preview={
        <ProfessionalLayout 
          data={previewData} 
          sections={sections} 
          role={data.personalInfo.role} 
          customColor={accentColor} 
          customFont={fontFamily} 
          headingSize={data.settings?.headingSize}
          fontSize={data.settings?.bodySize}
          layoutMode={data.settings?.layoutMode}
          spacing={data.settings?.spacingDensity}
        />
      }
    >
      <SectionReorderControl
        sections={sections}
        onReorder={setSections}
        onToggle={(id) => setSections(s => s.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x))}
        accent={accentColor}
      />

      <SectionHeader icon="👤" title="Personal Details" accent={accentColor} />
      <Field label="Full Name" name="name" value={data.personalInfo.name} onChange={setPersonal} accent={accentColor} placeholder="e.g. Alexander Wright" />
      <Field label="Professional Title" name="role" value={data.personalInfo.role} onChange={setPersonal} accent={accentColor} placeholder="e.g. Senior Project Manager" />
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

      <SectionHeader icon="📝" title="Professional Summary" accent={accentColor} />
      <TextArea label="Summary" value={data.summary} rows={5}
        onChange={e => setData(d => ({ ...d, summary: e.target.value }))} accent={accentColor} placeholder="Results-oriented professional with expertise in..." />

      <SectionHeader icon="💼" title="Work Experience" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.experience.map(exp => (
          <ItemCard key={exp.id} onDelete={() => delExp(exp.id)} accent={accentColor}>
            <Grid2>
              <Field label="Job Title" value={exp.role} onChange={e => updExp(exp.id, 'role', e.target.value)} accent={accentColor} />
              <Field label="Company" value={exp.company} onChange={e => updExp(exp.id, 'company', e.target.value)} accent={accentColor} />
            </Grid2>
            <Field label="Duration" value={exp.duration} onChange={e => updExp(exp.id, 'duration', e.target.value)} accent={accentColor} placeholder="2020 – Present" />
            <TextArea label="Responsibilities" value={exp.desc} onChange={e => updExp(exp.id, 'desc', e.target.value)} accent={accentColor} rows={4} />
          </ItemCard>
        ))}
      </div>
      <AddButton label="Add Work Experience" onClick={addExp} accent={accentColor} />

      <SectionHeader icon="🎓" title="Education" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.education.map(edu => (
          <ItemCard key={edu.id} onDelete={() => delEdu(edu.id)} accent={accentColor}>
            <Field label="Degree / Qualification" value={edu.degree} onChange={e => updEdu(edu.id, 'degree', e.target.value)} accent={accentColor} />
            <Grid2>
              <Field label="Institution" value={edu.institution} onChange={e => updEdu(edu.id, 'institution', e.target.value)} accent={accentColor} />
              <Field label="Years" value={edu.tenure} onChange={e => updEdu(edu.id, 'tenure', e.target.value)} accent={accentColor} />
            </Grid2>
          </ItemCard>
        ))}
      </div>
      <AddButton label="Add Education" onClick={addEdu} accent={accentColor} />

      <SectionHeader icon="⚡" title="Skills" accent={accentColor} />
      <SkillTagInput label="Add skills (press Enter)" skills={data.skills} onAdd={addSkill} onRemove={removeSkill} accent={accentColor} placeholder="e.g. Agile, Risk Management, Jira" />

      <SectionHeader icon="🏆" title="Certifications" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.certifications.map(cert => (
          <ItemCard key={cert.id} onDelete={() => delCert(cert.id)} accent={accentColor}>
            <Field label="Certification Name" value={cert.name} onChange={e => updCert(cert.id, 'name', e.target.value)} accent={accentColor} placeholder="e.g. PMP – Project Management Professional" />
            <Grid2>
              <Field label="Issuing Organisation" value={cert.org} onChange={e => updCert(cert.id, 'org', e.target.value)} accent={accentColor} placeholder="e.g. PMI" />
              <Field label="Year" value={cert.year} onChange={e => updCert(cert.id, 'year', e.target.value)} accent={accentColor} placeholder="e.g. 2023" />
            </Grid2>
          </ItemCard>
        ))}
      </div>
      <AddButton label="Add Certification" onClick={addCert} accent={accentColor} />

      <SectionHeader icon="🏆" title="Key Achievements" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(data.achievements || []).map((ach, idx) => (
          <ItemCard key={ach.id} onDelete={() => setData(d => ({ ...d, achievements: d.achievements.filter(a => a.id !== ach.id) }))} accent={accentColor} index={idx}>
            <Field label="Achievement Title" value={ach.title} onChange={e => setData(d => ({ ...d, achievements: d.achievements.map(a => a.id === ach.id ? { ...a, title: e.target.value } : a) }))} accent={accentColor} placeholder="e.g. Delivered $8M project on time" />
            <TextArea label="Details" value={ach.desc} onChange={e => setData(d => ({ ...d, achievements: d.achievements.map(a => a.id === ach.id ? { ...a, desc: e.target.value } : a) }))} accent={accentColor} rows={2} />
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Achievement" onClick={() => setData(d => ({ ...d, achievements: [...(d.achievements || []), { id: Date.now(), title: '', desc: '' }] }))} accent={accentColor} />

      <SectionHeader icon="🌐" title="Languages" accent={accentColor} />
      <SkillTagInput label="Add languages (press Enter)" skills={data.languages} onAdd={addLang} onRemove={removeLang} accent={accentColor} placeholder="e.g. English (Native)" />
      
      <div style={{ height: '1rem' }} />
      <SectionHeader icon="✍️" title="Signature" accent={accentColor} />
      <AddButton label="Add Signature" onClick={() => setIsSignatureModalOpen(true)} accent={accentColor} />
      
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

export default ProfessionalEditor;
