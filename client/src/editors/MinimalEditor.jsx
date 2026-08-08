import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MinimalLayout from '../components/layouts/MinimalLayout';
import {
  Field, TextArea, SectionHeader, AddButton, ItemCard, Grid2,
  SkillTagInput, EditorShell, SectionReorderControl, loadSession, saveSession
} from './editorUtils';
import SignatureModal from '../components/common/SignatureModal';

const defaultData = () => ({
  title: 'Minimal Resume',
  templateId: 'minimal',
  personalInfo: {
    name: 'Emily Chen',
    role: 'Senior Product Designer',
    email: 'emily@example.com',
    phone: '+1 (555) 123-4567',
    location: 'Austin, TX',
  },
  summary: 'Detail-oriented Product Designer with 6+ years of experience crafting intuitive interfaces and improving user journeys for enterprise software.',
  skills: ['UI/UX Design', 'Wireframing', 'Prototyping', 'Figma', 'User Research', 'Design Systems'],
  experience: [
    { id: 1, role: 'Senior Product Designer', company: 'TechNova Solutions', duration: '2020 – Present', desc: 'Led redesign of the core SaaS platform, increasing user retention by 25%.' }
  ],
  education: [
    { id: 1, degree: 'B.S. in Human-Computer Interaction', institution: 'Carnegie Mellon University', tenure: '2014 – 2018' }
  ],
  achievements: [],
  certificates: [],
  languagesList: [],
  signature: { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' },
});

const MinimalEditor = () => {
  const { sessionId } = useParams();
  const [saveStatus, setSaveStatus] = useState('All changes saved ✔');
  const [accentColor, setAccentColor] = useState('#374151');
  const [fontFamily, setFontFamily] = useState("'Inter', sans-serif");
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [sections, setSections] = useState([
    { id: 'summary', title: 'Summary', enabled: true },
    { id: 'experience', title: 'Experience', enabled: true },
    { id: 'education', title: 'Education', enabled: true },
    { id: 'skills', title: 'Skills', enabled: true },
    { id: 'achievements', title: 'Achievements', enabled: true },
    { id: 'certifications', title: 'Certifications', enabled: true },
    { id: 'languages', title: 'Languages', enabled: true },
  ]);

  const [data, setData] = useState(() => {
    const session = loadSession(sessionId);
    if (session) {
      return {
        title: session.title || 'Minimal Resume',
        templateId: 'minimal',
        personalInfo: {
          name: session.personalInfo?.name || '',
          role: session.personalInfo?.role || '',
          email: session.personalInfo?.email || '',
          phone: session.personalInfo?.phone || '',
          location: session.personalInfo?.location || '',
        },
        summary: session.personalInfo?.summary || '',
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
        achievements: (session.achievements || []).map((a, i) => ({ id: i + 1, title: a.title || '', desc: a.desc || '' })),
        certificates: (session.certificates || []).map((c, i) => ({ id: i + 1, name: c.name || c.title || '', organization: c.organization || c.org || '', year: c.year || '' })),
        languagesList: (session.languagesList || []).map((l, i) => ({ id: i + 1, name: l.name || '', level: l.level || '' })),
        signature: session.signature || { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' },
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
  const addExp = () => setData(d => ({ ...d, experience: [...d.experience, { id: Date.now(), role: '', company: '', duration: '', desc: '' }] }));
  const delExp = (id) => setData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));
  const updExp = (id, field, val) => setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, [field]: val } : e) }));
  const addEdu = () => setData(d => ({ ...d, education: [...d.education, { id: Date.now(), degree: '', institution: '', tenure: '' }] }));
  const delEdu = (id) => setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));
  const updEdu = (id, field, val) => setData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, [field]: val } : e) }));

  const previewData = {
    name: data.personalInfo.name,
    role: data.personalInfo.role,
    contact: { email: data.personalInfo.email, phone: data.personalInfo.phone, location: data.personalInfo.location },
    objective: data.summary,
    skills: { languages: data.skills.join(', '), frameworks: '', tools: '' },
    experience: data.experience.map(e => ({ title: e.role, company: e.company, duration: e.duration, desc: e.desc })),
    education: data.education.map(e => ({ degree: e.degree, institution: e.institution, tenure: e.tenure })),
    projects: [],
    training: (data.certificates || []).map(c => ({ title: c.name, org: c.organization, year: c.year })),
    languagesList: data.languagesList || [],
    achievements: data.achievements || [],
    signature: data.signature,
  };

  return (
    <EditorShell
      accentColor={accentColor}
      onColorChange={setAccentColor}
      fontFamily={fontFamily}
      onFontChange={setFontFamily}
      templateName="Minimal"
      templateEmoji="🪶"
      onDownload={() => window.print()}
      saveStatus={saveStatus}
      preview={<MinimalLayout data={previewData} sections={sections} role={data.personalInfo.role} customColor={accentColor} customFont={fontFamily} />}
    >
      <SectionReorderControl
        sections={sections}
        onReorder={setSections}
        onToggle={(id) => setSections(s => s.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x))}
        accent={accentColor}
      />

      <SectionHeader icon="👤" title="Personal Details" accent={accentColor} />
      <Field label="Full Name" name="name" value={data.personalInfo.name} onChange={setPersonal} accent={accentColor} />
      <Field label="Job Title" name="role" value={data.personalInfo.role} onChange={setPersonal} accent={accentColor} placeholder="e.g. Business Analyst" />
      <Grid2>
        <Field label="Email" name="email" value={data.personalInfo.email} onChange={setPersonal} accent={accentColor} />
        <Field label="Phone" name="phone" value={data.personalInfo.phone} onChange={setPersonal} accent={accentColor} />
      </Grid2>
      <Field label="Location" name="location" value={data.personalInfo.location} onChange={setPersonal} accent={accentColor} placeholder="City, State" />

      <SectionHeader icon="📝" title="Summary" accent={accentColor} />
      <TextArea label="Professional Summary" value={data.summary} rows={5}
        onChange={e => setData(d => ({ ...d, summary: e.target.value }))} accent={accentColor}
        placeholder="Brief, focused description of your professional value..." />

      <SectionHeader icon="⚡" title="Skills" accent={accentColor} />
      <SkillTagInput label="Add skills (press Enter)" skills={data.skills} onAdd={addSkill} onRemove={removeSkill} accent={accentColor} placeholder="e.g. SQL, Requirements Analysis" />

      <SectionHeader icon="💼" title="Experience" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.experience.map(exp => (
          <ItemCard key={exp.id} onDelete={() => delExp(exp.id)} accent={accentColor}>
            <Grid2>
              <Field label="Job Title" value={exp.role} onChange={e => updExp(exp.id, 'role', e.target.value)} accent={accentColor} />
              <Field label="Company" value={exp.company} onChange={e => updExp(exp.id, 'company', e.target.value)} accent={accentColor} />
            </Grid2>
            <Field label="Duration" value={exp.duration} onChange={e => updExp(exp.id, 'duration', e.target.value)} accent={accentColor} placeholder="2020 – Present" />
            <TextArea label="Key Contributions" value={exp.desc} onChange={e => updExp(exp.id, 'desc', e.target.value)} accent={accentColor} rows={3} />
          </ItemCard>
        ))}
      </div>
      <AddButton label="Add Experience" onClick={addExp} accent={accentColor} />

      <SectionHeader icon="🎓" title="Education" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.education.map(edu => (
          <ItemCard key={edu.id} onDelete={() => delEdu(edu.id)} accent={accentColor}>
            <Field label="Degree" value={edu.degree} onChange={e => updEdu(edu.id, 'degree', e.target.value)} accent={accentColor} />
            <Grid2>
              <Field label="Institution" value={edu.institution} onChange={e => updEdu(edu.id, 'institution', e.target.value)} accent={accentColor} />
              <Field label="Years" value={edu.tenure} onChange={e => updEdu(edu.id, 'tenure', e.target.value)} accent={accentColor} />
            </Grid2>
          </ItemCard>
        ))}
      </div>
      <AddButton label="Add Education" onClick={addEdu} accent={accentColor} />

      <SectionHeader icon="🏆" title="Key Achievements" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(data.achievements || []).map((ach, idx) => (
          <ItemCard key={ach.id} onDelete={() => setData(d => ({ ...d, achievements: d.achievements.filter(a => a.id !== ach.id) }))} accent={accentColor} index={idx}>
            <Field label="Achievement" value={ach.title} onChange={e => setData(d => ({ ...d, achievements: d.achievements.map(a => a.id === ach.id ? { ...a, title: e.target.value } : a) }))} accent={accentColor} placeholder="e.g. Reduced costs by 35%" />
            <TextArea label="Details" value={ach.desc} onChange={e => setData(d => ({ ...d, achievements: d.achievements.map(a => a.id === ach.id ? { ...a, desc: e.target.value } : a) }))} accent={accentColor} rows={2} />
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Achievement" onClick={() => setData(d => ({ ...d, achievements: [...(d.achievements || []), { id: Date.now(), title: '', desc: '' }] }))} accent={accentColor} />

      <SectionHeader icon="📜" title="Certifications" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(data.certificates || []).map((cert, idx) => (
          <ItemCard key={cert.id} onDelete={() => setData(d => ({ ...d, certificates: d.certificates.filter(c => c.id !== cert.id) }))} accent={accentColor} index={idx}>
            <Field label="Certificate" value={cert.name} onChange={e => setData(d => ({ ...d, certificates: d.certificates.map(c => c.id === cert.id ? { ...c, name: e.target.value } : c) }))} accent={accentColor} placeholder="e.g. CPA" />
            <Grid2>
              <Field label="Issuer" value={cert.organization} onChange={e => setData(d => ({ ...d, certificates: d.certificates.map(c => c.id === cert.id ? { ...c, organization: e.target.value } : c) }))} accent={accentColor} />
              <Field label="Year" value={cert.year} onChange={e => setData(d => ({ ...d, certificates: d.certificates.map(c => c.id === cert.id ? { ...c, year: e.target.value } : c) }))} accent={accentColor} placeholder="2023" />
            </Grid2>
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Certification" onClick={() => setData(d => ({ ...d, certificates: [...(d.certificates || []), { id: Date.now(), name: '', organization: '', year: '' }] }))} accent={accentColor} />

      <SectionHeader icon="🌐" title="Languages" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(data.languagesList || []).map((lang, idx) => (
          <ItemCard key={lang.id} onDelete={() => setData(d => ({ ...d, languagesList: d.languagesList.filter(l => l.id !== lang.id) }))} accent={accentColor} index={idx}>
            <Grid2>
              <Field label="Language" value={lang.name} onChange={e => setData(d => ({ ...d, languagesList: d.languagesList.map(l => l.id === lang.id ? { ...l, name: e.target.value } : l) }))} accent={accentColor} placeholder="e.g. English" />
              <Field label="Level" value={lang.level} onChange={e => setData(d => ({ ...d, languagesList: d.languagesList.map(l => l.id === lang.id ? { ...l, level: e.target.value } : l) }))} accent={accentColor} placeholder="e.g. Native" />
            </Grid2>
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Language" onClick={() => setData(d => ({ ...d, languagesList: [...(d.languagesList || []), { id: Date.now(), name: '', level: '' }] }))} accent={accentColor} />

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

export default MinimalEditor;
