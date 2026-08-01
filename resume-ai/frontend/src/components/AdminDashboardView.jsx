import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, ShieldAlert, Sparkles, Star, RefreshCw, BarChart3, Ticket, AlertCircle, FileText, Settings, HeartHandshake } from 'lucide-react';

const AdminDashboardView = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Seed Mock Admin Data
  const stats = {
    totalUsers: 1420,
    paidUsers: 340,
    freeUsers: 1080,
    monthlyRevenue: 101660, // 340 * 299
    successRate: '99.4%'
  };

  const usersList = [
    { name: 'Pooja R', email: 'pooja@gmail.com', role: 'Employee', sub: 'Premium', joined: '2026-07-30' },
    { name: 'Vijay Kumar', email: 'vijay@outlook.com', role: 'Employee', sub: 'Free', joined: '2026-07-31' },
    { name: 'Ritesh Shah', email: 'ritesh.shah@yahoo.com', role: 'Employee', sub: 'Premium', joined: '2026-07-28' },
    { name: 'Aruna Devi', email: 'aruna@gmail.com', role: 'HR', sub: 'Premium', joined: '2026-07-29' }
  ];

  const paymentsList = [
    { id: 'pay_XYZ123456', name: 'Pooja R', amount: '₹299.00', method: 'UPI (GPay)', status: 'Completed', date: '2026-07-30' },
    { id: 'pay_ABC987654', name: 'Ritesh Shah', amount: '₹299.00', method: 'Credit Card', status: 'Completed', date: '2026-07-28' },
    { id: 'pay_QWE456123', name: 'Aruna Devi', amount: '₹299.00', method: 'Net Banking', status: 'Completed', date: '2026-07-29' }
  ];

  const couponsList = [
    { code: 'OFF50', discount: '50%', status: 'Active', usageCount: 42 },
    { code: 'WELCOME10', discount: '10%', status: 'Active', usageCount: 154 },
    { code: 'FORGEINDIA', discount: '₹100 Off', status: 'Expired', usageCount: 88 }
  ];

  const promptConfigs = [
    { name: 'ATS Parser Prompt', type: 'System', model: 'Gemini 1.5 Flash', status: 'Active' },
    { name: 'Summary Optimizer', type: 'Completion', model: 'Gemini 1.5 Pro', status: 'Active' },
    { name: 'Resume Action Verbs Enricher', type: 'Completion', model: 'Gemini 1.5 Flash', status: 'Active' }
  ];

  const feedbackReports = [
    { from: 'Vijay Kumar', topic: 'Resume Download Failure', severity: 'High', date: '2026-07-31' },
    { from: 'Pooja R', topic: 'ATS Score optimization request', severity: 'Low', date: '2026-07-30' }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem', textAlign: 'left' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 950, letterSpacing: '-0.04em', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 600 }}>
            Manage platform users, transactions, coupons, templates, and AI prompts configurations.
          </p>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Registered Users</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', margin: '0.5rem 0' }}>{stats.totalUsers}</h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>+12% increase this week</span>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Pro Subs</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', margin: '0.5rem 0' }}>{stats.paidUsers}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pro conversion rate: {Math.round((stats.paidUsers / stats.totalUsers) * 100)}%</span>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Revenue</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981', margin: '0.5rem 0' }}>₹{stats.monthlyRevenue.toLocaleString()}</h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>100% payments verified</span>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Checkout Success Rate</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', margin: '0.5rem 0' }}>{stats.successRate}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Based on simulated orders</span>
        </div>
      </div>

      {/* Main Admin Workspace Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
        
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
            { id: 'users', label: 'Users Directory', icon: Users },
            { id: 'payments', label: 'Payments & Orders', icon: CreditCard },
            { id: 'coupons', label: 'Promo Coupons', icon: Ticket },
            { id: 'ai-prompts', label: 'AI Prompt Config', icon: Sparkles },
            { id: 'support', label: 'Reports & Support', icon: HeartHandshake }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.9rem 1.25rem',
                  borderRadius: '12px',
                  background: isActive ? 'var(--primary-glow)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  border: `1px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={18} />
                {tab.label}
              </div>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Activity Analytics</h3>
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', height: '240px', paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
                {[
                  { l: 'Mon', v: 420 },
                  { l: 'Tue', v: 680 },
                  { l: 'Wed', v: 850 },
                  { l: 'Thu', v: 1200 },
                  { l: 'Fri', v: 1420 }
                ].map((item, idx) => (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '100%', height: `${(item.v / 1500) * 100}%`, background: 'var(--grad-main)', borderRadius: '8px 8px 0 0', position: 'relative' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{item.l}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Daily active user growth patterns matches SaaS conversion targets.</p>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Users Directory</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Name</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Email</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Role</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Subscription</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((usr, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 0', fontWeight: 800 }}>{usr.name}</td>
                      <td style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>{usr.email}</td>
                      <td style={{ padding: '1rem 0', fontWeight: 700 }}>{usr.role}</td>
                      <td style={{ padding: '1rem 0' }}>
                        <span style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, background: usr.sub === 'Premium' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)', color: usr.sub === 'Premium' ? '#10b981' : 'var(--text-muted)' }}>
                          {usr.sub}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>{usr.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Transaction History</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Payment ID</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Customer</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Amount</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Method</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Status</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsList.map((pay, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 0', fontWeight: 800, color: 'var(--primary)' }}>{pay.id}</td>
                      <td style={{ padding: '1rem 0', fontWeight: 800 }}>{pay.name}</td>
                      <td style={{ padding: '1rem 0', fontWeight: 850 }}>{pay.amount}</td>
                      <td style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 600 }}>{pay.method}</td>
                      <td style={{ padding: '1rem 0' }}>
                        <span style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                          {pay.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>{pay.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'coupons' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Platform Coupons</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Coupon Code</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Discount Rate</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Active Status</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Usage Count</th>
                  </tr>
                </thead>
                <tbody>
                  {couponsList.map((cp, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 0', fontWeight: 900, color: 'var(--primary)' }}>{cp.code}</td>
                      <td style={{ padding: '1rem 0', fontWeight: 800 }}>{cp.discount}</td>
                      <td style={{ padding: '1rem 0' }}>
                        <span style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, background: cp.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: cp.status === 'Active' ? '#10b981' : '#ef4444' }}>
                          {cp.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0', fontWeight: 700 }}>{cp.usageCount} times</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'ai-prompts' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-main)' }}>AI Prompt Configurations</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Prompt Engine</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Type</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>LLM Model</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {promptConfigs.map((pr, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 0', fontWeight: 800 }}>{pr.name}</td>
                      <td style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 600 }}>{pr.type}</td>
                      <td style={{ padding: '1rem 0', fontWeight: 700, color: 'var(--primary)' }}>{pr.model}</td>
                      <td style={{ padding: '1rem 0' }}>
                        <span style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                          {pr.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'support' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-main)' }}>System Reports & Support</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Reporter</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Topic</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Severity</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackReports.map((rp, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 0', fontWeight: 800 }}>{rp.from}</td>
                      <td style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 650 }}>{rp.topic}</td>
                      <td style={{ padding: '1rem 0' }}>
                        <span style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, background: rp.severity === 'High' ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.05)', color: rp.severity === 'High' ? '#ef4444' : 'var(--text-muted)' }}>
                          {rp.severity}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>{rp.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default AdminDashboardView;
