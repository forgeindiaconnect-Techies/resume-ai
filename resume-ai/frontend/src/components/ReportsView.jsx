import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  ChevronDown, 
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

const ReportsView = ({ recentAnalyses }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = (recentAnalyses || []).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const downloadCSV = () => {
    let headers = [];
    let rows = [];
    let fileName = "";

    if (filter === 'Daily' || filter === 'All') {
      headers = ["DATE", "CANDIDATE NAME", "SCORE", "MATCH %", "STATUS", "SKILLS"];
      rows = filteredData.map(item => {
        const displaySkills = (item.matchedSkills && item.matchedSkills.length > 0) 
          ? item.matchedSkills 
          : (item.skills || []);
        const skillString = displaySkills.length > 0 
          ? displaySkills.map(s => typeof s === 'object' ? (s.name || s.skill || 'Skill') : s).join(', ')
          : "No skills detected";
        
        return [
          `"${item.timestamp || new Date().toLocaleString()}"`,
          `"${item.name || ''}"`,
          item.score,
          `"${item.matchPercentage || 0}%"`,
          `"${item.status || ''}"`,
          `"${skillString}"`
        ];
      });
      fileName = `ForgeIndia_DailyReport_${new Date().toISOString().slice(0,10)}.csv`;
    } else if (filter === 'Weekly') {
      headers = ["WEEK", "TOTAL RESUMES", "SELECTED", "REJECTED", "AVG SCORE", "AVG MATCH"];
      rows = getWeeklyData().map(item => [
        `"${item.week}"`,
        item.total,
        item.selected,
        item.rejected,
        item.avgScore,
        `"${item.avgMatch}%"`
      ]);
      fileName = `ForgeIndia_WeeklyReport_${new Date().toISOString().slice(0,10)}.csv`;
    } else if (filter === 'Monthly') {
      headers = ["MONTH", "TOTAL", "SELECTED", "REJECTED", "AVG SCORE", "AVG MATCH"];
      rows = getMonthlyData().map(item => [
        `"${item.month}"`,
        item.total,
        item.selected,
        item.rejected,
        item.avgScore,
        `"${item.avgMatch}%"`
      ]);
      fileName = `ForgeIndia_MonthlyReport_${new Date().toISOString().slice(0,10)}.csv`;
    }

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to group data
  const getDailyData = () => {
    const groups = {};
    filteredData.forEach(item => {
      const d = item.timestamp || new Date().toLocaleDateString();
      if (!groups[d]) groups[d] = [];
      groups[d].push(item);
    });
    return Object.entries(groups).map(([date, items]) => ({
      date,
      candidates: items
    }));
  };

  const getWeeklyData = () => {
    // Mocking week data for demonstration as we only have session data
    return [
      { week: 'Week 1 (Mar 1-7)', total: 50, selected: 20, rejected: 15, avgScore: 72, avgMatch: 75 },
      { week: 'Week 2 (Mar 8-14)', total: 60, selected: 25, rejected: 20, avgScore: 78, avgMatch: 80 }
    ];
  };

  const getMonthlyData = () => {
    return [
      { month: 'Jan 2026', total: 200, selected: 80, rejected: 60, avgScore: 75, avgMatch: 78 },
      { month: 'Feb 2026', total: 250, selected: 100, rejected: 70, avgScore: 80, avgMatch: 82 },
      { month: 'Mar 2026', total: recentAnalyses.length, selected: recentAnalyses.filter(a => a.status === 'Selected').length, rejected: recentAnalyses.filter(a => a.status === 'Rejected').length, avgScore: 74, avgMatch: 76 }
    ];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', paddingBottom: '2rem' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Recruitment Intelligence</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Daily, weekly, and monthly performance tracking.</p>
        </div>
        
        <button 
          onClick={downloadCSV}
          className="gradient-btn" 
          style={{ padding: '0.6rem 1.1rem', fontSize: '0.8rem' }}
        >
          <Download size={16} />
          DOWNLOAD REPORT
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div className="glass-card" style={{ flex: 1, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Resumes</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>{recentAnalyses.length}</h3>
          </div>
        </div>
        <div className="glass-card" style={{ flex: 1, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
              {recentAnalyses.filter(a => a.status === 'Selected').length}
            </h3>
          </div>
        </div>
        <div className="glass-card" style={{ flex: 1, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <XCircle size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rejected</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
              {recentAnalyses.filter(a => a.status === 'Rejected').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter & Table Section */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['Daily', 'Weekly', 'Monthly'].map(p => (
              <button 
                key={p}
                onClick={() => setFilter(p)}
                style={{ 
                  padding: '0.5rem 1.25rem', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border)', 
                  background: filter === p ? 'var(--grad-main)' : 'var(--bg-card)',
                  color: filter === p ? 'white' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {p} Report
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.65rem 1rem 0.65rem 2.6rem', 
                borderRadius: '12px', 
                background: 'var(--bg-sidebar)', 
                border: '1px solid var(--border)', 
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {filter === 'Daily' && (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="custom-scrollbar">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-card)' }}>
                  <tr>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Date</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Candidate Name</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Score</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Match %</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Status</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>{item.timestamp || new Date().toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 800 }}>{item.name}</td>
                      <td style={{ padding: '1rem', fontWeight: 900 }}>{item.score}</td>
                      <td style={{ padding: '1rem', fontWeight: 900, color: 'var(--primary)' }}>{item.matchPercentage}%</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800,
                          background: item.status === 'Selected' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: item.status === 'Selected' ? '#10b981' : '#ef4444'
                        }}>{item.status}</span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {((item.matchedSkills?.length > 0 ? item.matchedSkills : item.skills) || []).length > 0 ? (
                          <>
                            {((item.matchedSkills?.length > 0 ? item.matchedSkills : item.skills) || []).slice(0, 3).map(s => typeof s === 'object' ? s.name : s).join(', ')}
                            {((item.matchedSkills?.length > 0 ? item.matchedSkills : item.skills) || []).length > 3 ? '...' : ''}
                          </>
                        ) : (
                          <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No skills detected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>No reports found for this period.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {filter === 'Weekly' && (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="custom-scrollbar">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-card)' }}>
                  <tr>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Week</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Total Resumes</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Selected</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Rejected</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Avg Score</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Avg Match</th>
                  </tr>
                </thead>
                <tbody>
                  {getWeeklyData().map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', fontWeight: 800 }}>{item.week}</td>
                      <td style={{ padding: '1.25rem 1rem', fontWeight: 900 }}>{item.total}</td>
                      <td style={{ padding: '1.25rem 1rem', color: '#10b981', fontWeight: 900 }}>{item.selected}</td>
                      <td style={{ padding: '1.25rem 1rem', color: '#ef4444', fontWeight: 900 }}>{item.rejected}</td>
                      <td style={{ padding: '1.25rem 1rem', fontWeight: 900 }}>{item.avgScore}</td>
                      <td style={{ padding: '1.25rem 1rem', fontWeight: 900, color: 'var(--primary)' }}>{item.avgMatch}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filter === 'Monthly' && (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="custom-scrollbar">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-card)' }}>
                  <tr>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Month</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Total Resumes</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Selected</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Rejected</th>
                    <th style={{ padding: '1.25rem 1rem', borderBottom: '2px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, background: 'var(--bg-card)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>Avg Match</th>
                  </tr>
                </thead>
                <tbody>
                  {getMonthlyData().map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', fontWeight: 800 }}>{item.month}</td>
                      <td style={{ padding: '1.25rem 1rem', fontWeight: 900 }}>{item.total}</td>
                      <td style={{ padding: '1.25rem 1rem', color: '#10b981', fontWeight: 900 }}>{item.selected}</td>
                      <td style={{ padding: '1.25rem 1rem', color: '#ef4444', fontWeight: 900 }}>{item.rejected}</td>
                      <td style={{ padding: '1.25rem 1rem', fontWeight: 900, color: 'var(--primary)' }}>{item.avgMatch}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {filteredData.length === 0 && (
            <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
              <Filter size={48} style={{ marginBottom: '1rem' }} />
              <p style={{ fontWeight: 600 }}>No matching records found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
