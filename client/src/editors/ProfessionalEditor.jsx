import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfessionalLayout from '../components/layouts/ProfessionalLayout';
import {
  Field, TextArea, SectionHeader, AddButton, ItemCard, Grid2,
  SkillTagInput, EditorShell, loadSession, saveSession
} from './editorUtils';

const defaultData = () => ({
  title: 'Professional Resume',
  templateId: 'professional',
  personalInfo: {
    name: 'Alexander Wright',
    role: 'Project Manager',
    email: 'name@company.com',
    phone: '+1 (555) 000-0000',
    location: 'Chicago, IL',
    linkedin: 'linkedin.com/in/yourname',
  },
  summary: 'Results-oriented Project Manager with 7+ years of experience delivering cross-functional projects on time and within budget using Agile and Waterfall methodologies.',
  skills: ['Agile', 'Scrum', 'Risk Management', 'Stakeholder Communication', 'PMP', 'Jira', 'Confluence'],
  experience: [
    { id: 1, role: 'Senior Project Manager', company: 'Enterprise Solutions Ltd.', duration: '2018 – Present', desc: 'Managed a portfolio of 12 concurrent projects valued at $8M+.' }
  ],
  education: [
    { id: 1, degree: 'B.B.A – Business Management', institution: 'University of Illinois', tenure: '2012 – 2016' }
  ],
  certifications: [
    { id: 1, name: 'PMP – Project Management Professional', org: 'PMI', year: '2019' }
  ],
  languages: ['English (Native)', 'Spanish (Professional)'],
});

const ProfessionalEditor = () => {
  const { sessionId } = useParams();
  const [saveStatus, setSaveStatus] = useState('All changes saved ✔');
  const [accentColor, setAccentColor] = useState('#059669');
  const [fontFamily, setFontFamily] = useState("'Inter', sans-serif");
  
  const [data, setData] = useState(() => {
    const session = loadSession(sessionId);
    if (session) {
      return {
        title: session.title || 'Professional Resume',
        templateId: 'professional',
        personalInfo: {
          name: session.personalInfo?.name || session.personalInfo?.fullName || session.name || 'Alexander Wright',
          role: session.personalInfo?.role || session.role || 'Project Manager',
          email: session.personalInfo?.email || session.email || 'user@forgeindiaconnect.app',
          phone: session.personalInfo?.phone || session.phone || '+1 (555) 000-0000',
          location: session.personalInfo?.location || session.location || 'Chicago, IL',
          linkedin: session.personalInfo?.linkedin || session.linkedin || '',
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
        certifications: [],
        languages: [],
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

  const previewData = {
    name: data.personalInfo.name,
    role: data.personalInfo.role,
    contact: { email: data.personalInfo.email, phone: data.personalInfo.phone, location: data.personalInfo.location, linkedin: data.personalInfo.linkedin },
    objective: data.summary,
    skills: { languages: data.skills.slice(0, 4).join(', '), frameworks: data.skills.slice(4).join(', '), tools: data.languages.join(', ') },
    experience: data.experience.map(e => ({ title: e.role, company: e.company, duration: e.duration, desc: e.desc })),
    education: data.education.map(e => ({ degree: e.degree, institution: e.institution, tenure: e.tenure })),
    projects: data.certifications.map(c => ({ title: c.name, technology: c.org, desc: c.year })),
  };

  return (
    <EditorShell 
      accentColor={accentColor} 
      onColorChange={setAccentColor}
      fontFamily={fontFamily}
      onFontChange={setFontFamily}
      templateName="Professional" 
      templateEmoji="📋" 
      onDownload={() => window.print()} 
      saveStatus={saveStatus}
      preview={<ProfessionalLayout data={previewData} role={data.personalInfo.role} customColor={accentColor} customFont={fontFamily} />}
    >

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

      <SectionHeader icon="🌐" title="Languages" accent={accentColor} />
      <SkillTagInput label="Add languages (press Enter)" skills={data.languages} onAdd={addLang} onRemove={removeLang} accent={accentColor} placeholder="e.g. English (Native)" />
      <div style={{ height: '2rem' }} />
    </EditorShell>
  );
};

export default ProfessionalEditor;
