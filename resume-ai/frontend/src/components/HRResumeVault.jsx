import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Download, 
  ExternalLink, 
  Clock, 
  User, 
  Mail, 
  FileText, 
  RefreshCw,
  Eye,
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';

const HRResumeVault = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    const fetchResumes = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch from /api/candidates (correct collection where uploads are stored)
            const response = await fetch('/api/candidates');
            if (response.ok) {
                const data = await response.json();
                // Map Candidate fields to what the vault expects
                const mapped = (Array.isArray(data) ? data : []).map(c => ({
                    _id: c._id || c.id,
                    employeeName: c.name || 'Unknown',
                    email: c.email || 'N/A',
                    fileName: c.fileName || c.name || 'Unnamed File',
                    uploadDate: c.timestamp || c.createdAt || new Date().toISOString(),
                    score: c.score || 0,
                    status: c.status || c.verdict || 'Consider',
                    role: c.role || 'General',
                    filePath: c.filePath || null
                })).sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                setResumes(mapped);
            } else {
                throw new Error(`Server error: ${response.status}`);
            }
        } catch (err) {
            console.error('[HR Vault] Fetch error:', err);
            setError('Unable to reach the database. Please ensure MONGODB_URI is set and the backend is running.');
            setResumes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const filteredResumes = resumes.filter(r => 
        r.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-0.04em', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                        Resume <span className="gradient-text">Vault</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600 }}>
                        Direct access to all documents uploaded by candidates.
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fetchResumes}
                    className="glass-btn btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '14px', fontWeight: 800 }}
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh Data
                </motion.button>
            </div>

            {/* Stats & Search */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div className="glass-card" style={{ flex: 1, padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)' }}>
                    <Search size={20} color="var(--primary)" />
                    <input 
                        type="text" 
                        placeholder="Search by name, email or filename..." 
                        style={{ background: 'none', border: 'none', color: 'var(--text-main)', width: '100%', outline: 'none', fontSize: '1rem', fontWeight: 600 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="glass-card" style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px', background: 'var(--grad-main)', color: '#0f172a' }}>
                    <FileText size={20} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase' }}>Total Resumes</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{filteredResumes.length}</span>
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <AlertCircle size={20} />
                    <span style={{ fontWeight: 700 }}>{error}</span>
                </div>
            )}

            {/* Table Section */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1.5rem', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Employee Details</th>
                                <th style={{ padding: '1.5rem', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>File Information</th>
                                <th style={{ padding: '1.5rem', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Upload Date</th>
                                <th style={{ padding: '1.5rem', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredResumes.length > 0 ? filteredResumes.map((resume, idx) => (
                                    <motion.tr 
                                            key={resume._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--grad-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
                                                        <User size={20} />
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{resume.employeeName}</span>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                            <Mail size={12} /> {resume.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{ padding: '0.5rem', background: 'rgba(0,102,204,0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
                                                            <FileText size={18} />
                                                        </div>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{resume.fileName}</span>
                                                    </div>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, paddingLeft: '3rem' }}>{resume.role}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
                                                    <span style={{ 
                                                        fontSize: '1.3rem', fontWeight: 900,
                                                        color: resume.score >= 75 ? '#10b981' : resume.score >= 60 ? 'var(--primary)' : '#ef4444'
                                                    }}>{resume.score}</span>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>/ 100</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                                                    <Calendar size={16} />
                                                    {new Date(resume.uploadDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                                <div style={{
                                                    display: 'inline-block',
                                                    padding: '0.5rem 1.25rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 900,
                                                    textTransform: 'uppercase',
                                                    background: resume.status === 'Selected' ? '#10b98115' :
                                                                resume.status === 'Rejected' ? '#ef444415' :
                                                                '#3b82f615',
                                                    color: resume.status === 'Selected' ? '#10b981' :
                                                           resume.status === 'Rejected' ? '#ef4444' :
                                                           '#3b82f6'
                                                }}>
                                                    {resume.status}
                                                </div>
                                            </td>
                                        </motion.tr>
                                )) : !loading && (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '5rem', textAlign: 'center' }}>
                                            <div style={{ opacity: 0.3, marginBottom: '1.5rem' }}>
                                                <FileText size={64} style={{ margin: '0 auto' }} />
                                            </div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-muted)' }}>No resumes found in the vault.</h3>
                                            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto' }}>
                                                Resumes uploaded by candidates will appear here automatically for direct access.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <RefreshCw size={32} color="var(--primary)" className="animate-spin" />
                </div>
            )}
        </div>
    );
};

export default HRResumeVault;
