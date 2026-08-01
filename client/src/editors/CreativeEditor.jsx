import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CreativeLayout from '../components/layouts/CreativeLayout';
import {
  Field, TextArea, SectionHeader, AddButton, ItemCard, Grid2,
  SkillTagInput, EditorShell, loadSession, saveSession
} from './editorUtils';

const ACCENT = '#7c3aed';

const buildDefaultFromSession = (session) => ({
  title: session.title || 'Creative Resume',
  templateId: 'creative',
  personalInfo: {
    name: session.personalInfo?.name || '',
    role: session.personalInfo?.role || '',
    email: session.personalInfo?.email || '',
    phone: session.personalInfo?.phone || '',
    location: session.personalInfo?.location || '',
    portfolio: session.personalInfo?.portfolio || '',
    behance: '',
    dribbble: '',
  },
  summary: session.personalInfo?.summary || '',
  designSkills: [
    ...(session.skills?.programming || []),
    ...(session.skills?.frameworks || []),
    ...(session.skills?.databases || []),
  ].filter(Boolean),
  projects: (session.projects || []).map((p, i) => ({
    id: i + 1,
    title: p.name || p.title || '',
    technology: p.technology || p.tools || '',
    link: p.github || p.liveDemo || '',
    desc: p.desc || p.description || '',
  })),
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
});

const defaultData = () => ({
  title: 'Creative Resume',
  templateId: 'creative',
  personalInfo: {
    name: 'Your Full Name',
    role: 'UI/UX Designer',
    email: 'hello@yourportfolio.com',
    phone: '+1 (555) 000-0000',
    location: 'Los Angeles, CA',
    portfolio: 'yourportfolio.com',
    behance: 'behance.net/yourname',
    dribbble: 'dribbble.com/yourname',
  },
  summary: 'Empathetic, user-centered designer with 5+ years crafting intuitive digital experiences that delight users and drive business results.',
  designSkills: ['Figma', 'Adobe XD', 'Prototyping', 'Wireframing', 'User Research', 'Design Systems'],
  projects: [
    { id: 1, title: 'Mobile Banking App Redesign', technology: 'Figma, Principle, InVision', link: '', desc: 'Redesigned the onboarding flow reducing drop-off rate by 28%.' }
  ],
  experience: [
    { id: 1, title: 'Senior UI/UX Designer', company: 'Creative Edge Media', duration: '2020 – Present', desc: 'Led design for iOS/Android app with 1M+ downloads.' }
  ],
  education: [
    { id: 1, degree: 'B.F.A. in Interaction Design', institution: 'Rhode Island School of Design', tenure: '2015 – 2019' }
  ],
});

const CreativeEditor = () => {
  const { sessionId } = useParams();
  const [saveStatus, setSaveStatus] = useState('All changes saved ✔');
  const [data, setData] = useState(() => {
    const session = loadSession(sessionId);
    return session ? buildDefaultFromSession(session) : defaultData();
  });

  useEffect(() => {
    setSaveStatus('Saving…');
    const t = setTimeout(() => { saveSession(sessionId, data); setSaveStatus('All changes saved ✔'); }, 900);
    return () => clearTimeout(t);
  }, [data, sessionId]);

  const setPersonal = (e) => setData(d => ({ ...d, personalInfo: { ...d.personalInfo, [e.target.name]: e.target.value } }));

  const addSkill = (sk) => setData(d => ({ ...d, designSkills: [...d.designSkills, sk] }));
  const removeSkill = (i) => setData(d => ({ ...d, designSkills: d.designSkills.filter((_, idx) => idx !== i) }));

  const addProj = () => setData(d => ({ ...d, projects: [...d.projects, { id: Date.now(), title: '', technology: '', link: '', desc: '' }] }));
  const delProj = (id) => setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }));
  const updProj = (id, field, val) => setData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, [field]: val } : p) }));

  const addExp = () => setData(d => ({ ...d, experience: [...d.experience, { id: Date.now(), title: '', company: '', duration: '', desc: '' }] }));
  const delExp = (id) => setData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));
  const updExp = (id, field, val) => setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, [field]: val } : e) }));

  const addEdu = () => setData(d => ({ ...d, education: [...d.education, { id: Date.now(), degree: '', institution: '', tenure: '' }] }));
  const delEdu = (id) => setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));
  const updEdu = (id, field, val) => setData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, [field]: val } : e) }));

  // Build preview data exactly matching CreativeLayout's expected shape
  const previewData = {
    name: data.personalInfo.name,
    role: data.personalInfo.role,
    contact: {
      email: data.personalInfo.email,
      phone: data.personalInfo.phone,
      location: data.personalInfo.location,
      linkedin: data.personalInfo.portfolio || data.personalInfo.behance || '',
      github: data.personalInfo.dribbble || '',
    },
    objective: data.summary,
    skills: {
      languages: data.designSkills.slice(0, 5).join(', '),
      frameworks: data.designSkills.slice(5).join(', '),
      tools: '',
    },
    experience: data.experience.map(e => ({
      title: e.title,
      company: e.company,
      duration: e.duration,
      desc: e.desc,
    })),
    education: data.education.map(e => ({
      degree: e.degree,
      institution: e.institution,
      tenure: e.tenure,
    })),
    // Projects MUST use title/technology/desc for CreativeLayout
    projects: data.projects.map(p => ({
      title: p.title,
      technology: p.technology,
      desc: p.desc,
    })),
    training: [],
    languagesList: [],
  };

  return (
    <EditorShell
      accentColor={ACCENT}
      templateName="Creative"
      templateEmoji="🎨"
      onDownload={() => window.print()}
      saveStatus={saveStatus}
      preview={<CreativeLayout data={previewData} role={data.personalInfo.role} customColor={ACCENT} />}
    >
      {/* ── Personal & Branding ── */}
      <SectionHeader icon="👤" title="Personal & Branding" accent={ACCENT} />
      <Field label="Full Name" name="name" value={data.personalInfo.name} onChange={setPersonal} accent={ACCENT} placeholder="Your Full Name" />
      <Field label="Creative Role / Title" name="role" value={data.personalInfo.role} onChange={setPersonal} accent={ACCENT} placeholder="e.g. UI/UX Designer, Brand Designer" />
      <Grid2>
        <Field label="Email" name="email" value={data.personalInfo.email} onChange={setPersonal} accent={ACCENT} />
        <Field label="Phone" name="phone" value={data.personalInfo.phone} onChange={setPersonal} accent={ACCENT} />
      </Grid2>
      <Field label="Location" name="location" value={data.personalInfo.location} onChange={setPersonal} accent={ACCENT} placeholder="City, Country" />

      {/* ── Portfolio & Social Links ── */}
      <SectionHeader icon="🔗" title="Portfolio & Social Links" accent={ACCENT} />
      <Field label="Portfolio Website" name="portfolio" value={data.personalInfo.portfolio} onChange={setPersonal} accent={ACCENT} placeholder="yourportfolio.com" />
      <Grid2>
        <Field label="Behance" name="behance" value={data.personalInfo.behance} onChange={setPersonal} accent={ACCENT} placeholder="behance.net/name" />
        <Field label="Dribbble" name="dribbble" value={data.personalInfo.dribbble} onChange={setPersonal} accent={ACCENT} placeholder="dribbble.com/name" />
      </Grid2>

      {/* ── Professional Summary ── */}
      <SectionHeader icon="✨" title="Professional Summary" accent={ACCENT} />
      <TextArea
        label="Summary"
        value={data.summary}
        rows={5}
        onChange={e => setData(d => ({ ...d, summary: e.target.value }))}
        accent={ACCENT}
        placeholder="Describe your creative philosophy and impact..."
      />

      {/* ── Design Skills ── */}
      <SectionHeader icon="🛠" title="Design Skills & Tools" accent={ACCENT} />
      <SkillTagInput
        label="Skills (press Enter to add)"
        skills={data.designSkills}
        onAdd={addSkill}
        onRemove={removeSkill}
        accent={ACCENT}
        placeholder="e.g. Figma, Prototyping, Adobe XD"
      />

      {/* ── Projects / Case Studies ── */}
      <SectionHeader icon="🖼" title="Projects & Case Studies" accent={ACCENT} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.projects.map((proj, idx) => (
          <ItemCard key={proj.id} onDelete={() => delProj(proj.id)} accent={ACCENT} index={idx}>
            <Field
              label="Project Name"
              value={proj.title}
              onChange={e => updProj(proj.id, 'title', e.target.value)}
              accent={ACCENT}
              placeholder="e.g. Banking App Redesign"
            />
            <Grid2>
              <Field
                label="Tools Used"
                value={proj.technology}
                onChange={e => updProj(proj.id, 'technology', e.target.value)}
                accent={ACCENT}
                placeholder="Figma, Principle"
              />
              <Field
                label="Live / Behance Link"
                value={proj.link}
                onChange={e => updProj(proj.id, 'link', e.target.value)}
                accent={ACCENT}
                placeholder="behance.net/project"
              />
            </Grid2>
            <TextArea
              label="What problem did you solve?"
              value={proj.desc}
              onChange={e => updProj(proj.id, 'desc', e.target.value)}
              accent={ACCENT}
              rows={3}
              placeholder="Describe the impact — e.g. reduced drop-off by 28%"
            />
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Project / Case Study" onClick={addProj} accent={ACCENT} />

      {/* ── Work Experience ── */}
      <SectionHeader icon="💼" title="Work Experience" accent={ACCENT} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.experience.map((exp, idx) => (
          <ItemCard key={exp.id} onDelete={() => delExp(exp.id)} accent={ACCENT} index={idx}>
            <Grid2>
              <Field label="Job Title" value={exp.title} onChange={e => updExp(exp.id, 'title', e.target.value)} accent={ACCENT} placeholder="Senior Designer" />
              <Field label="Company / Studio" value={exp.company} onChange={e => updExp(exp.id, 'company', e.target.value)} accent={ACCENT} />
            </Grid2>
            <Field label="Duration" value={exp.duration} onChange={e => updExp(exp.id, 'duration', e.target.value)} accent={ACCENT} placeholder="2021 – Present" />
            <TextArea label="Responsibilities & Achievements" value={exp.desc} onChange={e => updExp(exp.id, 'desc', e.target.value)} accent={ACCENT} rows={3} />
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Work Experience" onClick={addExp} accent={ACCENT} />

      {/* ── Education ── */}
      <SectionHeader icon="🎓" title="Education" accent={ACCENT} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.education.map((edu, idx) => (
          <ItemCard key={edu.id} onDelete={() => delEdu(edu.id)} accent={ACCENT} index={idx}>
            <Field label="Degree / Course" value={edu.degree} onChange={e => updEdu(edu.id, 'degree', e.target.value)} accent={ACCENT} placeholder="B.F.A. in Interaction Design" />
            <Grid2>
              <Field label="Institution" value={edu.institution} onChange={e => updEdu(edu.id, 'institution', e.target.value)} accent={ACCENT} />
              <Field label="Years" value={edu.tenure} onChange={e => updEdu(edu.id, 'tenure', e.target.value)} accent={ACCENT} placeholder="2018 – 2022" />
            </Grid2>
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Education" onClick={addEdu} accent={ACCENT} />

      <div style={{ height: '2rem' }} />
    </EditorShell>
  );
};

export default CreativeEditor;
