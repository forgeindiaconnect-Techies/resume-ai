import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MinimalLayout from '../components/layouts/MinimalLayout';
import {
  Field, TextArea, SectionHeader, AddButton, ItemCard, Grid2,
  SkillTagInput, EditorShell, loadSession, saveSession
} from './editorUtils';

const ACCENT = '#374151';

const defaultData = () => ({
  title: 'Minimal Resume',
  templateId: 'minimal',
  personalInfo: {
    name: 'Your Full Name',
    role: 'Business Analyst',
    email: 'name@email.com',
    phone: '+1 (555) 000-0000',
    location: 'Austin, TX',
  },
  summary: 'Detail-oriented Business Analyst with 5+ years translating complex business requirements into actionable insights and technical specifications.',
  skills: ['Requirements Analysis', 'SQL', 'Data Visualisation', 'Stakeholder Management', 'BPMN', 'Excel'],
  experience: [
    { id: 1, role: 'Business Analyst', company: 'Strategic Advisors LLC', duration: '2019 – Present', desc: 'Streamlined reporting processes reducing analysis time by 35%.' }
  ],
  education: [
    { id: 1, degree: 'B.Sc. in Business Information Systems', institution: 'University of Texas', tenure: '2014 – 2018' }
  ],
});

const MinimalEditor = () => {
  const { sessionId } = useParams();
  const [saveStatus, setSaveStatus] = useState('All changes saved ✔');
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
  };

  return (
    <EditorShell accentColor={ACCENT} templateName="Minimal" templateEmoji="🪶" onDownload={() => window.print()} saveStatus={saveStatus}
      preview={<MinimalLayout data={previewData} role={data.personalInfo.role} customColor={ACCENT} />}>

      <SectionHeader icon="👤" title="Personal Details" accent={ACCENT} />
      <Field label="Full Name" name="name" value={data.personalInfo.name} onChange={setPersonal} accent={ACCENT} />
      <Field label="Job Title" name="role" value={data.personalInfo.role} onChange={setPersonal} accent={ACCENT} placeholder="e.g. Business Analyst" />
      <Grid2>
        <Field label="Email" name="email" value={data.personalInfo.email} onChange={setPersonal} accent={ACCENT} />
        <Field label="Phone" name="phone" value={data.personalInfo.phone} onChange={setPersonal} accent={ACCENT} />
      </Grid2>
      <Field label="Location" name="location" value={data.personalInfo.location} onChange={setPersonal} accent={ACCENT} placeholder="City, State" />

      <SectionHeader icon="📝" title="Summary" accent={ACCENT} />
      <TextArea label="Professional Summary" value={data.summary} rows={5}
        onChange={e => setData(d => ({ ...d, summary: e.target.value }))} accent={ACCENT}
        placeholder="Brief, focused description of your professional value..." />

      <SectionHeader icon="⚡" title="Skills" accent={ACCENT} />
      <SkillTagInput label="Add skills (press Enter)" skills={data.skills} onAdd={addSkill} onRemove={removeSkill} accent={ACCENT} placeholder="e.g. SQL, Requirements Analysis" />

      <SectionHeader icon="💼" title="Experience" accent={ACCENT} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.experience.map(exp => (
          <ItemCard key={exp.id} onDelete={() => delExp(exp.id)} accent={ACCENT}>
            <Grid2>
              <Field label="Job Title" value={exp.role} onChange={e => updExp(exp.id, 'role', e.target.value)} accent={ACCENT} />
              <Field label="Company" value={exp.company} onChange={e => updExp(exp.id, 'company', e.target.value)} accent={ACCENT} />
            </Grid2>
            <Field label="Duration" value={exp.duration} onChange={e => updExp(exp.id, 'duration', e.target.value)} accent={ACCENT} placeholder="2020 – Present" />
            <TextArea label="Key Contributions" value={exp.desc} onChange={e => updExp(exp.id, 'desc', e.target.value)} accent={ACCENT} rows={3} />
          </ItemCard>
        ))}
      </div>
      <AddButton label="Add Experience" onClick={addExp} accent={ACCENT} />

      <SectionHeader icon="🎓" title="Education" accent={ACCENT} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.education.map(edu => (
          <ItemCard key={edu.id} onDelete={() => delEdu(edu.id)} accent={ACCENT}>
            <Field label="Degree" value={edu.degree} onChange={e => updEdu(edu.id, 'degree', e.target.value)} accent={ACCENT} />
            <Grid2>
              <Field label="Institution" value={edu.institution} onChange={e => updEdu(edu.id, 'institution', e.target.value)} accent={ACCENT} />
              <Field label="Years" value={edu.tenure} onChange={e => updEdu(edu.id, 'tenure', e.target.value)} accent={ACCENT} />
            </Grid2>
          </ItemCard>
        ))}
      </div>
      <AddButton label="Add Education" onClick={addEdu} accent={ACCENT} />
      <div style={{ height: '2rem' }} />
    </EditorShell>
  );
};

export default MinimalEditor;
