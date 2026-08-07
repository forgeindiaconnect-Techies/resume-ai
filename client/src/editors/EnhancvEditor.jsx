import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EnhancvLayout from '../components/layouts/EnhancvLayout';
import {
  Field, TextArea, SectionHeader, AddButton, ItemCard, Grid2,
  SkillTagInput, EditorShell, SectionReorderControl, loadSession, saveSession
} from './editorUtils';
import SignatureModal from '../components/common/SignatureModal';

const buildFromSession = (session) => ({
  title: session.title || 'Project Manager Resume',
  templateId: 'enhancv',
  personalInfo: {
    name: session.personalInfo?.name || session.personalInfo?.fullName || session.name || 'Alexander Wright',
    role: session.personalInfo?.role || session.role || 'Business Professional',
    email: session.personalInfo?.email || session.email || 'user@forgeindiaconnect.app',
    phone: session.personalInfo?.phone || session.phone || '+1 (555) 000-0000',
    location: session.personalInfo?.location || session.location || 'New York, NY',
    linkedin: session.personalInfo?.linkedin || session.linkedin || '',
    github: session.personalInfo?.github || session.github || '',
  },
  summary: session.personalInfo?.summary || session.summary || session.objective || '',
  skills: {
    languages: Array.isArray(session.skills?.programming)
      ? session.skills.programming
      : (typeof session.skills?.languages === 'string' ? session.skills.languages.split(',').map(s => s.trim()) : []),
    frameworks: Array.isArray(session.skills?.frameworks)
      ? session.skills.frameworks
      : (typeof session.skills?.frameworks === 'string' ? session.skills.frameworks.split(',').map(s => s.trim()) : []),
    tools: Array.isArray(session.skills?.databases)
      ? session.skills.databases
      : (typeof session.skills?.tools === 'string' ? session.skills.tools.split(',').map(s => s.trim()) : []),
  },
  projects: (session.projects || []).map((p, i) => ({
    id: i + 1,
    title: p.name || p.title || '',
    technology: p.technology || '',
    github: p.github || '',
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
    cgpa: e.cgpa || '',
  })),
  certificates: (session.certificates || []).map((c, i) => ({
    id: i + 1,
    name: c.name || c.title || '',
    organization: c.organization || c.org || '',
    year: c.year || '',
  })),
  achievements: (session.achievements || []).map((a, i) => ({ id: i + 1, title: a.title || '', desc: a.desc || a.description || '' })),
  languagesList: (session.languagesList || []).map((l, i) => ({ id: i + 1, name: l.name || '', level: l.level || '' })),
  signature: session.signature || { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' },
});

const defaultData = () => ({
  title: 'Project Manager Resume',
  templateId: 'enhancv',
  personalInfo: {
    name: 'Alexander Wright',
    role: 'Software Engineer',
    email: 'dev@email.com',
    phone: '+1 (555) 000-0000',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/yourname',
    github: 'github.com/yourname',
  },
  summary: 'Performance-driven Software Engineer with 4+ years of experience building high-throughput web applications and REST APIs. Passionate about clean code and scalable architecture.',
  skills: {
    languages: ['JavaScript', 'TypeScript', 'Python'],
    frameworks: ['React', 'Node.js', 'Express', 'Next.js'],
    tools: ['Docker', 'AWS', 'PostgreSQL', 'Git'],
  },
  projects: [
    { id: 1, title: 'Real-Time Collaboration Engine', technology: 'React, WebSockets, Node.js', github: 'github.com/yourname/project', desc: 'Engineered multi-user document editor supporting concurrent edits.' }
  ],
  experience: [
    { id: 1, title: 'Software Engineer', company: 'CloudScale Technologies', duration: '2020 – Present', desc: 'Architected microservices handling 2M+ daily requests with 99.99% uptime.' }
  ],
  education: [
    { id: 1, degree: 'B.S. in Computer Science', institution: 'University of Washington', tenure: '2016 – 2020', cgpa: '3.9' }
  ],
  certificates: [],
  achievements: [],
  languagesList: [],
  signature: { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' },
});

const EnhancvEditor = () => {
  const { sessionId } = useParams();
  const [saveStatus, setSaveStatus] = useState('All changes saved ✔');
  const [accentColor, setAccentColor] = useState('#2a85ff');
  const [fontFamily, setFontFamily] = useState("'Rubik', sans-serif");
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [sections, setSections] = useState([
    { id: 'summary', title: 'Summary', enabled: true },
    { id: 'experience', title: 'Experience', enabled: true },
    { id: 'projects', title: 'Projects', enabled: true },
    { id: 'skills', title: 'Skills', enabled: true },
    { id: 'education', title: 'Education', enabled: true },
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

  // Skills
  const addLang = (sk) => setData(d => ({ ...d, skills: { ...d.skills, languages: [...d.skills.languages, sk] } }));
  const removeLang = (i) => setData(d => ({ ...d, skills: { ...d.skills, languages: d.skills.languages.filter((_, idx) => idx !== i) } }));
  const addFw = (sk) => setData(d => ({ ...d, skills: { ...d.skills, frameworks: [...d.skills.frameworks, sk] } }));
  const removeFw = (i) => setData(d => ({ ...d, skills: { ...d.skills, frameworks: d.skills.frameworks.filter((_, idx) => idx !== i) } }));
  const addTool = (sk) => setData(d => ({ ...d, skills: { ...d.skills, tools: [...d.skills.tools, sk] } }));
  const removeTool = (i) => setData(d => ({ ...d, skills: { ...d.skills, tools: d.skills.tools.filter((_, idx) => idx !== i) } }));

  // Projects
  const addProj = () => setData(d => ({ ...d, projects: [...d.projects, { id: Date.now(), title: '', technology: '', github: '', desc: '' }] }));
  const delProj = (id) => setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }));
  const updProj = (id, f, v) => setData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, [f]: v } : p) }));

  // Experience
  const addExp = () => setData(d => ({ ...d, experience: [...d.experience, { id: Date.now(), title: '', company: '', duration: '', desc: '' }] }));
  const delExp = (id) => setData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));
  const updExp = (id, f, v) => setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, [f]: v } : e) }));

  // Education
  const addEdu = () => setData(d => ({ ...d, education: [...d.education, { id: Date.now(), degree: '', institution: '', tenure: '', cgpa: '' }] }));
  const delEdu = (id) => setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));
  const updEdu = (id, f, v) => setData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, [f]: v } : e) }));

  // Certificates
  const addCert = () => setData(d => ({ ...d, certificates: [...(d.certificates || []), { id: Date.now(), name: '', organization: '', year: '' }] }));
  const delCert = (id) => setData(d => ({ ...d, certificates: d.certificates.filter(c => c.id !== id) }));
  const updCert = (id, f, v) => setData(d => ({ ...d, certificates: d.certificates.map(c => c.id === id ? { ...c, [f]: v } : c) }));

  // Achievements
  const addAch = () => setData(d => ({ ...d, achievements: [...(d.achievements || []), { id: Date.now(), title: '', desc: '' }] }));
  const delAch = (id) => setData(d => ({ ...d, achievements: d.achievements.filter(a => a.id !== id) }));
  const updAch = (id, f, v) => setData(d => ({ ...d, achievements: d.achievements.map(a => a.id === id ? { ...a, [f]: v } : a) }));

  // Languages
  const addLangItem = () => setData(d => ({ ...d, languagesList: [...(d.languagesList || []), { id: Date.now(), name: '', level: '' }] }));
  const delLangItem = (id) => setData(d => ({ ...d, languagesList: d.languagesList.filter(l => l.id !== id) }));
  const updLangItem = (id, f, v) => setData(d => ({ ...d, languagesList: d.languagesList.map(l => l.id === id ? { ...l, [f]: v } : l) }));

  const previewData = {
    name: data.personalInfo.name,
    role: data.personalInfo.role,
    contact: { email: data.personalInfo.email, phone: data.personalInfo.phone, location: data.personalInfo.location, linkedin: data.personalInfo.linkedin, github: data.personalInfo.github },
    objective: data.summary,
    skills: { languages: data.skills.languages.join(', '), frameworks: data.skills.frameworks.join(', '), tools: data.skills.tools.join(', ') },
    experience: data.experience.map(e => ({ title: e.title, company: e.company, duration: e.duration, desc: e.desc })),
    education: data.education.map(e => ({ degree: e.degree, institution: e.institution, tenure: e.tenure, cgpa: e.cgpa })),
    projects: data.projects.map(p => ({ title: p.title, technology: p.technology, desc: p.desc })),
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
      templateName="enhancv" 
      templateEmoji="💻" 
      onDownload={() => window.print()} 
      saveStatus={saveStatus}
      preview={<EnhancvLayout data={previewData} sections={sections} role={data.personalInfo.role} customColor={accentColor} customFont={fontFamily} />}
    >
      <SectionReorderControl
        sections={sections}
        onReorder={setSections}
        onToggle={(id) => setSections(s => s.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x))}
        accent={accentColor}
      />

      <SectionHeader icon="👤" title="Personal Details" accent={accentColor} />
      <Field label="Full Name" name="name" value={data.personalInfo.name} onChange={setPersonal} accent={accentColor} placeholder="e.g. Alexander Wright" />
      <Field label="Job Title / Role" name="role" value={data.personalInfo.role} onChange={setPersonal} accent={accentColor} placeholder="e.g. Senior Software Engineer" />
      <Grid2>
        <Field label="Email" name="email" value={data.personalInfo.email} onChange={setPersonal} accent={accentColor} />
        <Field label="Phone" name="phone" value={data.personalInfo.phone} onChange={setPersonal} accent={accentColor} />
      </Grid2>
      <Field label="Location" name="location" value={data.personalInfo.location} onChange={setPersonal} accent={accentColor} />
      <Grid2>
        <Field label="LinkedIn" name="linkedin" value={data.personalInfo.linkedin} onChange={setPersonal} accent={accentColor} placeholder="linkedin.com/in/name" />
        <Field label="GitHub" name="github" value={data.personalInfo.github} onChange={setPersonal} accent={accentColor} placeholder="github.com/yourname" />
      </Grid2>

      <SectionHeader icon="📝" title="Professional Summary" accent={accentColor} />
      <TextArea label="Summary" value={data.summary} rows={5}
        onChange={e => setData(d => ({ ...d, summary: e.target.value }))} accent={accentColor} placeholder="Performance-driven engineer specializing in..." />

      <SectionHeader icon="⚙️" title="Technical Skills" accent={accentColor} />
      <SkillTagInput label="Core Skills / Languages" skills={data.skills.languages} onAdd={addLang} onRemove={removeLang} accent={accentColor} placeholder="e.g. JavaScript, Python, Go" />
      <SkillTagInput label="Frameworks & Libraries" skills={data.skills.frameworks} onAdd={addFw} onRemove={removeFw} accent={accentColor} placeholder="e.g. React, Node.js, Django" />
      <SkillTagInput label="Tools & Databases" skills={data.skills.tools} onAdd={addTool} onRemove={removeTool} accent={accentColor} placeholder="e.g. Docker, PostgreSQL, AWS" />

      <SectionHeader icon="💼" title="Work Experience" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.experience.map((exp, idx) => (
          <ItemCard key={exp.id} onDelete={() => delExp(exp.id)} accent={accentColor} index={idx}>
            <Grid2>
              <Field label="Job Title" value={exp.title} onChange={e => updExp(exp.id, 'title', e.target.value)} accent={accentColor} />
              <Field label="Company" value={exp.company} onChange={e => updExp(exp.id, 'company', e.target.value)} accent={accentColor} />
            </Grid2>
            <Field label="Duration" value={exp.duration} onChange={e => updExp(exp.id, 'duration', e.target.value)} accent={accentColor} placeholder="2022 – Present" />
            <TextArea label="Responsibilities & Impact" value={exp.desc} onChange={e => updExp(exp.id, 'desc', e.target.value)} accent={accentColor} rows={4} />
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Work Experience" onClick={addExp} accent={accentColor} />

      <SectionHeader icon="🎓" title="Education" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.education.map((edu, idx) => (
          <ItemCard key={edu.id} onDelete={() => delEdu(edu.id)} accent={accentColor} index={idx}>
            <Field label="Degree" value={edu.degree} onChange={e => updEdu(edu.id, 'degree', e.target.value)} accent={accentColor} />
            <Grid2>
              <Field label="Institution" value={edu.institution} onChange={e => updEdu(edu.id, 'institution', e.target.value)} accent={accentColor} />
              <Field label="Years" value={edu.tenure} onChange={e => updEdu(edu.id, 'tenure', e.target.value)} accent={accentColor} />
            </Grid2>
            <Field label="CGPA / GPA (optional)" value={edu.cgpa} onChange={e => updEdu(edu.id, 'cgpa', e.target.value)} accent={accentColor} placeholder="e.g. 3.9 / 4.0" />
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Education" onClick={addEdu} accent={accentColor} />

      <SectionHeader icon="🚀" title="Projects" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.projects.map((proj, idx) => (
          <ItemCard key={proj.id} onDelete={() => delProj(proj.id)} accent={accentColor} index={idx}>
            <Field label="Project Name" value={proj.title} onChange={e => updProj(proj.id, 'title', e.target.value)} accent={accentColor} placeholder="e.g. E-Commerce Platform" />
            <Grid2>
              <Field label="Tech Stack" value={proj.technology} onChange={e => updProj(proj.id, 'technology', e.target.value)} accent={accentColor} placeholder="React, Node.js, MongoDB" />
              <Field label="GitHub Link" value={proj.github} onChange={e => updProj(proj.id, 'github', e.target.value)} accent={accentColor} placeholder="github.com/repo" />
            </Grid2>
            <TextArea label="Description & Impact" value={proj.desc} onChange={e => updProj(proj.id, 'desc', e.target.value)} accent={accentColor} rows={3} />
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Project" onClick={addProj} accent={accentColor} />

      <SectionHeader icon="🏆" title="Key Achievements" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(data.achievements || []).map((ach, idx) => (
          <ItemCard key={ach.id} onDelete={() => delAch(ach.id)} accent={accentColor} index={idx}>
            <Field label="Achievement Title" value={ach.title} onChange={e => updAch(ach.id, 'title', e.target.value)} accent={accentColor} placeholder="e.g. Reduced costs by 30%" />
            <TextArea label="Details" value={ach.desc} onChange={e => updAch(ach.id, 'desc', e.target.value)} accent={accentColor} rows={2} />
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Achievement" onClick={addAch} accent={accentColor} />

      <SectionHeader icon="📜" title="Certifications & Training" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(data.certificates || []).map((cert, idx) => (
          <ItemCard key={cert.id} onDelete={() => delCert(cert.id)} accent={accentColor} index={idx}>
            <Field label="Certificate Name" value={cert.name} onChange={e => updCert(cert.id, 'name', e.target.value)} accent={accentColor} placeholder="e.g. AWS Certified Solutions Architect" />
            <Grid2>
              <Field label="Issuing Organization" value={cert.organization} onChange={e => updCert(cert.id, 'organization', e.target.value)} accent={accentColor} placeholder="e.g. Amazon Web Services" />
              <Field label="Year" value={cert.year} onChange={e => updCert(cert.id, 'year', e.target.value)} accent={accentColor} placeholder="e.g. 2023" />
            </Grid2>
          </ItemCard>
        ))}
      </div>
      <AddButton label="+ Add Certification" onClick={addCert} accent={accentColor} />

      <SectionHeader icon="🌐" title="Languages" accent={accentColor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(data.languagesList || []).map((lang, idx) => (
          <ItemCard key={lang.id} onDelete={() => delLangItem(lang.id)} accent={accentColor} index={idx}>
            <Grid2>
              <Field label="Language" value={lang.name} onChange={e => updLangItem(lang.id, 'name', e.target.value)} accent={accentColor} placeholder="e.g. English" />
              <Field label="Proficiency Level" value={lang.level} onChange={e => updLangItem(lang.id, 'level', e.target.value)} accent={accentColor} placeholder="e.g. Native, Fluent, Advanced" />
            </Grid2>
          </ItemCard>
        ))}
      </div>
      <AddButton label="Add Language" onClick={addLangItem} accent={accentColor} />

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

export default EnhancvEditor;
