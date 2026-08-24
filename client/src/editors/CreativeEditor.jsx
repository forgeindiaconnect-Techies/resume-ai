import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CreativeLayout from '../components/layouts/CreativeLayout';
import {
  Field, TextArea, SectionHeader, FormAccordionSection, AddButton, ItemCard, Grid2,
  SkillTagInput, EditorShell, SectionReorderControl, loadSession, saveSession
} from './editorUtils';
import SignatureModal from '../components/common/SignatureModal';

const buildDefaultFromSession = (session) => ({
  title: session.title || 'Creative Resume',
  templateId: 'creative',
  personalInfo: {
    name: session.personalInfo?.name || session.personalInfo?.fullName || session.name || 'Jane Doe',
    role: session.personalInfo?.role || session.role || 'Creative Director',
    email: session.personalInfo?.email || session.email || 'jane@example.com',
    phone: session.personalInfo?.phone || session.phone || '+1 (555) 000-0000',
    location: session.personalInfo?.location || session.location || 'San Francisco, CA',
    portfolio: session.personalInfo?.portfolio || session.portfolio || '',
    behance: session.personalInfo?.behance || session.behance || '',
    dribbble: session.personalInfo?.dribbble || session.dribbble || '',
  },
  summary: session.personalInfo?.summary || session.summary || session.objective || '',
  designSkills: [
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
  projects: (session.projects || []).map((p, i) => ({
    id: i + 1,
    title: p.name || p.title || '',
    technology: p.technology || '',
    link: p.github || p.link || '',
    desc: p.desc || p.description || '',
  })),
  education: (session.education || []).map((e, i) => ({
    id: i + 1,
    degree: e.degree || '',
    institution: e.institution || e.school || '',
    tenure: e.tenure || '',
  })),
  certificates: (session.certificates || []).map((c, i) => ({
    id: i + 1,
    name: c.name || c.title || '',
    organization: c.organization || c.org || '',
    year: c.year || '',
  })),
  achievements: (session.achievements || []).map((a, i) => ({ id: i + 1, title: a.title || '', desc: a.desc || a.description || '' })),
  languagesList: (session.languagesList || []).map((l, i) => ({
    id: i + 1,
    name: l.name || '',
    level: l.level || '',
  })),
  signature: session.signature || { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' },
});

const defaultData = () => ({
  title: 'Creative Resume',
  templateId: 'creative',
  personalInfo: {
    name: 'Jane Doe',
    role: 'Creative Director',
    email: 'jane@example.com',
    phone: '+1 (555) 000-0000',
    location: 'San Francisco, CA',
    portfolio: 'portfolio.com/janedoe',
    behance: 'behance.net/janedoe',
    dribbble: '',
  },
  summary: 'Award-winning Creative Director with 10+ years of experience leading design teams and executing multi-channel global campaigns. Passionate about brand storytelling and user-centric design.',
  designSkills: ['UI/UX Design', 'Brand Identity', 'Adobe Creative Suite', 'Figma', 'Typography', 'Prototyping'],
  projects: [
    { id: 1, title: 'Global Rebranding', technology: 'Figma, Illustrator', link: 'behance.net/rebrand', desc: 'Led the visual rebranding for a Fortune 500 company.' }
  ],
  experience: [
    { id: 1, title: 'Creative Director', company: 'DesignWorks Studio', duration: '2019 – Present', desc: 'Managed a team of 15 designers and directed 50+ major campaigns.' }
  ],
  education: [
    { id: 1, degree: 'BFA in Graphic Design', institution: 'Rhode Island School of Design', tenure: '2012 – 2016' }
  ],
  certificates: [],
  achievements: [],
  languagesList: [],
  signature: { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' },
});

const CreativeEditor = () => {
  const { sessionId } = useParams();
  const [saveStatus, setSaveStatus] = useState('All changes saved ✔');
  const [accentColor, setAccentColor] = useState(() => {
    const session = loadSession(sessionId);
    return session?.color || '#7c3aed';
  });
  const [fontFamily, setFontFamily] = useState(() => {
    const session = loadSession(sessionId);
    return session?.font || "'Inter', sans-serif";
  });
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [sections, setSections] = useState([
    { id: 'summary', title: 'Summary', enabled: true },
    { id: 'experience', title: 'Experience', enabled: true },
    { id: 'projects', title: 'Projects', enabled: true },
    { id: 'skills', title: 'Skills', enabled: true },
    { id: 'education', title: 'Education', enabled: true },
    { id: 'achievements', title: 'Achievements', enabled: true },
    { id: 'certifications', title: 'Certifications', enabled: true },
    { id: 'languages', title: 'Languages', enabled: true },
  ]);

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
    projects: data.projects.map(p => ({
      title: p.title,
      technology: p.technology,
      desc: p.desc,
    })),
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
      templateName="Creative"
      templateEmoji="🎨"
      onDownload={() => window.print()}
      saveStatus={saveStatus}
      formData={data}
      preview={<CreativeLayout data={previewData} sections={sections} role={data.personalInfo.role} customColor={accentColor} customFont={fontFamily} />}
    >
      {/* ── Drag & Drop Section Reordering Control ── */}
      <SectionReorderControl
        sections={sections}
        onReorder={setSections}
        onToggle={(id) => setSections(s => s.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x))}
        accent={accentColor}
      />
      {/* ── Personal & Branding ── */}
      <FormAccordionSection icon="👤" title="Personal & Branding" accent={accentColor} defaultExpanded={true}>
        <Field label="Full Name" name="name" value={data.personalInfo.name} onChange={setPersonal} accent={accentColor} placeholder="Your Full Name" />
        <Field label="Creative Role / Title" name="role" value={data.personalInfo.role} onChange={setPersonal} accent={accentColor} placeholder="e.g. UI/UX Designer, Brand Designer" />
        <Grid2>
          <Field label="Email" name="email" value={data.personalInfo.email} onChange={setPersonal} accent={accentColor} />
          <Field label="Phone" name="phone" value={data.personalInfo.phone} onChange={setPersonal} accent={accentColor} />
        </Grid2>
        <Field label="Location" name="location" value={data.personalInfo.location} onChange={setPersonal} accent={accentColor} placeholder="City, Country" />
      </FormAccordionSection>

      {/* ── Portfolio & Social Links ── */}
      <FormAccordionSection icon="🔗" title="Portfolio & Social Links" accent={accentColor} defaultExpanded={false}>
        <Field label="Portfolio Website" name="portfolio" value={data.personalInfo.portfolio} onChange={setPersonal} accent={accentColor} placeholder="yourportfolio.com" />
        <Grid2>
          <Field label="Behance" name="behance" value={data.personalInfo.behance} onChange={setPersonal} accent={accentColor} placeholder="behance.net/name" />
          <Field label="Dribbble" name="dribbble" value={data.personalInfo.dribbble} onChange={setPersonal} accent={accentColor} placeholder="dribbble.com/name" />
        </Grid2>
      </FormAccordionSection>

      {/* ── Professional Summary ── */}
      <FormAccordionSection icon="✨" title="Professional Summary" accent={accentColor} defaultExpanded={true}>
        <TextArea
          label="Summary"
          value={data.summary}
          rows={5}
          onChange={e => setData(d => ({ ...d, summary: e.target.value }))}
          accent={accentColor}
          placeholder="Describe your creative philosophy and impact..."
        />
      </FormAccordionSection>

      {/* ── Design Skills ── */}
      <FormAccordionSection icon="🛠" title="Design Skills & Tools" accent={accentColor} defaultExpanded={true}>
        <SkillTagInput
          label="Skills (press Enter to add)"
          skills={data.designSkills}
          onAdd={addSkill}
          onRemove={removeSkill}
          accent={accentColor}
          placeholder="e.g. Figma, Prototyping, Adobe XD"
        />
      </FormAccordionSection>

      {/* ── Projects / Case Studies ── */}
      <FormAccordionSection icon="🖼" title="Projects & Case Studies" accent={accentColor} defaultExpanded={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.projects.map((proj, idx) => (
            <ItemCard key={proj.id} onDelete={() => delProj(proj.id)} accent={accentColor} index={idx}>
              <Field
                label="Project Name"
                value={proj.title}
                onChange={e => updProj(proj.id, 'title', e.target.value)}
                accent={accentColor}
                placeholder="e.g. Banking App Redesign"
              />
              <Grid2>
                <Field
                  label="Tools Used"
                  value={proj.technology}
                  onChange={e => updProj(proj.id, 'technology', e.target.value)}
                  accent={accentColor}
                  placeholder="Figma, Principle"
                />
                <Field
                  label="Live / Behance Link"
                  value={proj.link}
                  onChange={e => updProj(proj.id, 'link', e.target.value)}
                  accent={accentColor}
                  placeholder="behance.net/project"
                />
              </Grid2>
              <TextArea
                label="What problem did you solve?"
                value={proj.desc}
                onChange={e => updProj(proj.id, 'desc', e.target.value)}
                accent={accentColor}
                rows={3}
                placeholder="Describe the impact — e.g. reduced drop-off by 28%"
              />
            </ItemCard>
          ))}
        </div>
        <AddButton label="+ Add Project / Case Study" onClick={addProj} accent={accentColor} />
      </FormAccordionSection>

      {/* ── Work Experience ── */}
      <FormAccordionSection icon="💼" title="Work Experience" accent={accentColor} defaultExpanded={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.experience.map((exp, idx) => (
            <ItemCard key={exp.id} onDelete={() => delExp(exp.id)} accent={accentColor} index={idx}>
              <Grid2>
                <Field label="Job Title" value={exp.title} onChange={e => updExp(exp.id, 'title', e.target.value)} accent={accentColor} placeholder="Senior Designer" />
                <Field label="Company / Studio" value={exp.company} onChange={e => updExp(exp.id, 'company', e.target.value)} accent={accentColor} />
              </Grid2>
              <Field label="Duration" value={exp.duration} onChange={e => updExp(exp.id, 'duration', e.target.value)} accent={accentColor} placeholder="2021 – Present" />
              <TextArea label="Responsibilities & Achievements" value={exp.desc} onChange={e => updExp(exp.id, 'desc', e.target.value)} accent={accentColor} rows={3} />
            </ItemCard>
          ))}
        </div>
        <AddButton label="+ Add Work Experience" onClick={addExp} accent={accentColor} />
      </FormAccordionSection>

      {/* ── Education ── */}
      <FormAccordionSection icon="🎓" title="Education" accent={accentColor} defaultExpanded={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.education.map((edu, idx) => (
            <ItemCard key={edu.id} onDelete={() => delEdu(edu.id)} accent={accentColor} index={idx}>
              <Field label="Degree / Course" value={edu.degree} onChange={e => updEdu(edu.id, 'degree', e.target.value)} accent={accentColor} placeholder="B.F.A. in Interaction Design" />
              <Grid2>
                <Field label="Institution" value={edu.institution} onChange={e => updEdu(edu.id, 'institution', e.target.value)} accent={accentColor} />
                <Field label="Years" value={edu.tenure} onChange={e => updEdu(edu.id, 'tenure', e.target.value)} accent={accentColor} placeholder="2018 – 2022" />
              </Grid2>
            </ItemCard>
          ))}
        </div>
        <AddButton label="+ Add Education" onClick={addEdu} accent={accentColor} />
      </FormAccordionSection>

      {/* ── Achievements ── */}
      <FormAccordionSection icon="🏆" title="Key Achievements" accent={accentColor} defaultExpanded={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(data.achievements || []).map((ach, idx) => (
            <ItemCard key={ach.id} onDelete={() => setData(d => ({ ...d, achievements: d.achievements.filter(a => a.id !== ach.id) }))} accent={accentColor} index={idx}>
              <Field label="Achievement Title" value={ach.title} onChange={e => setData(d => ({ ...d, achievements: d.achievements.map(a => a.id === ach.id ? { ...a, title: e.target.value } : a) }))} accent={accentColor} placeholder="e.g. Won Best UX Award 2023" />
              <TextArea label="Details" value={ach.desc} onChange={e => setData(d => ({ ...d, achievements: d.achievements.map(a => a.id === ach.id ? { ...a, desc: e.target.value } : a) }))} accent={accentColor} rows={2} />
            </ItemCard>
          ))}
        </div>
        <AddButton label="+ Add Achievement" onClick={() => setData(d => ({ ...d, achievements: [...(d.achievements || []), { id: Date.now(), title: '', desc: '' }] }))} accent={accentColor} />
      </FormAccordionSection>

      {/* ── Certifications ── */}
      <FormAccordionSection icon="📜" title="Certifications" accent={accentColor} defaultExpanded={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(data.certificates || []).map((cert, idx) => (
            <ItemCard key={cert.id} onDelete={() => setData(d => ({ ...d, certificates: d.certificates.filter(c => c.id !== cert.id) }))} accent={accentColor} index={idx}>
              <Field label="Certificate Name" value={cert.name} onChange={e => setData(d => ({ ...d, certificates: d.certificates.map(c => c.id === cert.id ? { ...c, name: e.target.value } : c) }))} accent={accentColor} placeholder="e.g. Google UX Design Certificate" />
              <Grid2>
                <Field label="Issuer" value={cert.organization} onChange={e => setData(d => ({ ...d, certificates: d.certificates.map(c => c.id === cert.id ? { ...c, organization: e.target.value } : c) }))} accent={accentColor} />
                <Field label="Year" value={cert.year} onChange={e => setData(d => ({ ...d, certificates: d.certificates.map(c => c.id === cert.id ? { ...c, year: e.target.value } : c) }))} accent={accentColor} placeholder="2023" />
              </Grid2>
            </ItemCard>
          ))}
        </div>
        <AddButton label="+ Add Certification" onClick={() => setData(d => ({ ...d, certificates: [...(d.certificates || []), { id: Date.now(), name: '', organization: '', year: '' }] }))} accent={accentColor} />
      </FormAccordionSection>

      {/* ── Languages ── */}
      <FormAccordionSection icon="🌐" title="Languages" accent={accentColor} defaultExpanded={false}>
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
      </FormAccordionSection>
      <AddButton label="Add Language" onClick={() => setData(d => ({ ...d, languagesList: [...(d.languagesList || []), { id: Date.now(), name: '', level: '' }] }))} accent={accentColor} />

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

export default CreativeEditor;
