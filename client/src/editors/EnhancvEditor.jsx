import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EnhancvLayout from '../components/layouts/EnhancvLayout';
import {
  Field, TextArea, SectionHeader, AddButton, ItemCard, Grid2,
  SkillTagInput, EditorShell, SectionReorderControl, loadSession, saveSession
} from './editorUtils';
import SignatureModal from '../components/common/SignatureModal';
import QrScanUploadSection from '../components/common/QrScanUploadSection';

const buildFromSession = (session) => ({
  title: session.title || 'Project Manager Resume',
  templateId: 'enhancv',
  personalInfo: {
    name: session.personalInfo?.name || session.personalInfo?.fullName || session.name || 'Rohan Sharma',
    role: session.personalInfo?.role || session.role || 'Senior Technical Project Manager | PMP',
    email: session.personalInfo?.email || session.email || 'rohan.sharma@forgeindiaconnect.com',
    phone: session.personalInfo?.phone || session.phone || '+91 98765 43210',
    location: session.personalInfo?.location || session.location || 'Bengaluru, Karnataka',
    linkedin: session.personalInfo?.linkedin || session.linkedin || 'linkedin.com/in/rohan-sharma-pmp',
    github: session.personalInfo?.github || session.github || '',
  },
  summary: session.personalInfo?.summary || session.summary || session.objective || '',
  skills: {
    languages: Array.isArray(session.skills?.programming)
      ? session.skills.programming
      : (typeof session.skills?.languages === 'string' ? session.skills.languages.split(',').map(s => s.trim()) : ['Agile Scrum', 'JIRA & Confluence', 'PMP Standards']),
    frameworks: Array.isArray(session.skills?.frameworks)
      ? session.skills.frameworks
      : (typeof session.skills?.frameworks === 'string' ? session.skills.frameworks.split(',').map(s => s.trim()) : ['Sprint Planning', 'Risk Mitigation']),
    tools: Array.isArray(session.skills?.databases)
      ? session.skills.databases
      : (typeof session.skills?.tools === 'string' ? session.skills.tools.split(',').map(s => s.trim()) : ['Asana', 'MS Project', 'Tableau BI']),
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
    title: e.role || e.title || '',
    company: e.company || '',
    duration: e.duration || '',
    desc: e.desc || '',
  })),
  education: (session.education || []).map((e, i) => ({
    id: i + 1,
    degree: e.degree || '',
    institution: e.institution || e.school || '',
    tenure: e.tenure || e.year || '',
    cgpa: e.cgpa || '',
  })),
  certificates: (session.certificates || []).map((c, i) => ({
    id: i + 1,
    name: c.name || c.title || '',
    organization: c.organization || c.org || '',
    year: c.year || '',
  })),
  achievements: (session.achievements || []).map((a, i) => ({
    id: i + 1,
    title: a.title || '',
    desc: a.desc || a.description || '',
  })),
  languagesList: (session.languagesList || []).map((l, i) => ({
    id: i + 1,
    name: l.name || '',
    level: l.level || '',
  })),
  signature: session.signature || { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' },
});

const defaultData = () => ({
  title: 'Project Manager Resume',
  templateId: 'enhancv',
  personalInfo: {
    name: 'Rohan Sharma',
    role: 'Senior Technical Project Manager | PMP',
    email: 'rohan.sharma@forgeindiaconnect.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    linkedin: 'linkedin.com/in/rohan-sharma-pmp',
    github: '',
  },
  summary: 'PMP-certified Senior Technical Project Manager with 8+ years of experience leading cross-functional engineering teams in fintech and SaaS. Delivered enterprise projects worth ₹45 Cr+ on time and under budget while improving team sprint velocity by 35%.',
  skills: {
    languages: ['Agile Scrum', 'JIRA & Confluence', 'PMP Standards', 'Sprint Planning', 'Risk Mitigation'],
    frameworks: ['Budgeting & Forecasting', 'Stakeholder Management', 'UPI & Fintech Architecture'],
    tools: ['Asana', 'MS Project', 'Tableau BI', 'GitLab'],
  },
  projects: [
    { id: 1, title: 'Enterprise Instant Payouts Engine', technology: 'Agile, JIRA, Microservices', github: '', desc: 'Directed deployment of high-resilience payout infrastructure handling 2.5M transactions daily across 6 major Indian banking nodes.' }
  ],
  experience: [
    { id: 1, title: 'Lead Technical Project Manager', company: 'Razorpay Technologies', duration: '2021 – Present', desc: '• Spearheaded 12 sprint squads delivering UPI 2.0 multi-bank settlement platform processing ₹1,200 Cr+ monthly GMV.\n• Reduced production incident resolution cycle times by 42% through automated JIRA & CI/CD workflows.' }
  ],
  education: [
    { id: 1, degree: 'B.Tech in Computer Science & Engineering', institution: 'National Institute of Technology (NIT) Trichy', tenure: '2014 – 2018', cgpa: '8.9 / 10' }
  ],
  certificates: [
    { id: 1, name: 'Project Management Professional (PMP)®', organization: 'PMI', year: '2021' }
  ],
  achievements: [],
  languagesList: [
    { id: 1, name: 'English', level: 'Fluent' },
    { id: 2, name: 'Hindi', level: 'Native' }
  ],
  signature: { type: null, text: '', font: 'Great Vibes', url: '', size: 100, position: 'right' },
});

const EnhancvEditor = () => {
  const { sessionId } = useParams();
  const [saveStatus, setSaveStatus] = useState('All changes saved ✔');
  const [accentColor, setAccentColor] = useState(() => {
    const session = loadSession(sessionId);
    return session?.color || '#2a85ff';
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
      github: data.personalInfo.github,
      showQrCode: data.personalInfo.showQrCode !== false,
      qrTarget: data.personalInfo.qrTarget || 'linkedin',
      customQrImage: data.personalInfo.customQrImage || null,
      showRecruiterBadges: data.personalInfo.showRecruiterBadges === true,
      noticePeriod: data.personalInfo.noticePeriod || 'Immediate Joiner',
      totalExp: data.personalInfo.totalExp || '5+ Years',
      workPreference: data.personalInfo.workPreference || 'Hybrid'
    },
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
      formData={data}
      onUpdateSkills={(newSkill) => {
        setData(d => ({
          ...d,
          skills: {
            ...d.skills,
            languages: Array.isArray(d.skills?.languages)
              ? (d.skills.languages.some(s => s.toLowerCase() === newSkill.toLowerCase()) ? d.skills.languages : [...d.skills.languages, newSkill])
              : [newSkill]
          }
        }));
      }}
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

      {/* ─── Profile QR Code & Custom Image Upload ─── */}
      <QrScanUploadSection personalInfo={data.personalInfo} onChange={setPersonal} accentColor={accentColor} />

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
