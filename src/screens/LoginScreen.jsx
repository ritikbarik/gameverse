import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gamepad2,
  Users,
  ShieldAlert,
  ArrowRight,
  User,
  Key,
  ShieldCheck,
  Coffee,
  PlaySquare,
  Sparkles,
  Lock
} from 'lucide-react';

export default function LoginScreen({ onLoginSuccess, onBackToLanding }) {
  const { login, loginDirect, users } = useApp();

  // 3 Portals: 'customer' | 'staff' | 'admin'
  const [selectedPortal, setSelectedPortal] = useState('staff');
  const [username, setUsername] = useState('staff');
  const [password, setPassword] = useState('staff123');
  const [errorMsg, setErrorMsg] = useState('');

  const portals = [
    {
      id: 'customer',
      title: 'Customer Portal',
      role: 'Customer',
      tag: 'Gamer & Visitor Access',
      tagColor: '#C62828',
      tagBg: '#FDECEC',
      icon: Gamepad2,
      desc: 'Browse real-time station availability, reserve PC/Console/VR setups, order café snacks, and track live session bills.',
      features: ['Station Availability', 'Reservations', 'Café Ordering', 'Itemized Bills'],
      defaultUser: users.find(u => u.role === 'Customer') || {
        username: 'rohan',
        password: 'cust123',
        name: 'Rohan Sharma',
        role: 'Customer',
        user_id: 'USR-004'
      }
    },
    {
      id: 'staff',
      title: 'Staff Operations Portal',
      role: 'Staff',
      tag: 'Reception Desk & Café Counter',
      tagColor: '#B71C1C',
      tagBg: '#FFF5F5',
      icon: Users,
      desc: 'Consolidated operations for front desk and café floor: customer check-ins, reservations, active session tracking, food orders, and billing.',
      features: ['Front Desk Check-in', 'Start/End Sessions', 'Café Orders', 'Payment Processing', 'Stock Alerts'],
      defaultUser: users.find(u => u.role === 'Staff' || u.role === 'Receptionist') || {
        username: 'staff',
        password: 'staff123',
        name: 'Sarah Connor',
        role: 'Staff',
        user_id: 'USR-002'
      }
    },
    {
      id: 'admin',
      title: 'Administrator Portal',
      role: 'Administrator',
      tag: 'Full System Control',
      tagColor: '#C62828',
      tagBg: '#FDECEC',
      icon: ShieldCheck,
      desc: 'Complete system oversight: configure gaming stations & pricing, manage employee credentials, maintain inventory, and generate business reports.',
      features: ['Station Config', 'Staff & User Mgmt', 'Master Inventory', 'Revenue & Usage Reports'],
      defaultUser: users.find(u => u.role === 'Administrator') || {
        username: 'admin',
        password: 'admin123',
        name: 'Admin System',
        role: 'Administrator',
        user_id: 'USR-001'
      }
    }
  ];

  const currentPortalConfig = portals.find(p => p.id === selectedPortal);

  const handlePortalSelect = (portal) => {
    setSelectedPortal(portal.id);
    setUsername(portal.defaultUser.username);
    setPassword(portal.defaultUser.password);
    setErrorMsg('');
  };

  const handleQuickLogin = (portal) => {
    const userToLogin = portal.defaultUser;
    const res = loginDirect(userToLogin);
    if (res.success && onLoginSuccess) {
      onLoginSuccess(userToLogin);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    const res = login(username, password);
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess(res.user);
    } else {
      setErrorMsg(res.message || 'Invalid username or password.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-app)',
      padding: '2rem',
      position: 'relative'
    }}>
      <div style={{ width: '100%', maxWidth: '980px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            borderRadius: '18px',
            background: '#C62828',
            boxShadow: '0 8px 24px rgba(198, 40, 40, 0.25)',
            marginBottom: '1rem'
          }}>
            <Gamepad2 size={32} color="#ffffff" />
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            GAMEVERSE
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: 600 }}>
            GAMING CAFÉ MANAGEMENT SYSTEM • SECURE PORTAL AUTHENTICATION
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-card)',
            padding: '0.3rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: '#C62828',
            fontWeight: 700,
            marginTop: '0.75rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2E7D32', display: 'inline-block' }} />
            <span>Select Your Assigned Portal Below • Session is Locked Until Sign Out</span>
          </div>
        </div>

        {/* Step 1: 3-Portal Selection Cards */}
        <div className="portal-select-grid">
          {portals.map((portal) => {
            const Icon = portal.icon;
            const isSelected = selectedPortal === portal.id;
            return (
              <div
                key={portal.id}
                className={`portal-card ${isSelected ? 'active' : ''}`}
                onClick={() => handlePortalSelect(portal)}
              >
                <div className="portal-icon-box">
                  <Icon size={26} />
                </div>

                <div
                  className="portal-card-tag"
                  style={{ color: portal.tagColor, background: portal.tagBg }}
                >
                  {portal.tag}
                </div>

                <h3 className="portal-title">{portal.title}</h3>
                <p className="portal-desc">{portal.desc}</p>

                <div className="portal-badge-features">
                  {portal.features.map((feat, fIdx) => (
                    <span key={fIdx} className="portal-feature-pill">{feat}</span>
                  ))}
                </div>

                <button
                  type="button"
                  className="portal-btn-enter"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickLogin(portal);
                  }}
                  title={`Direct 1-Click Access as ${portal.defaultUser.name}`}
                >
                  <span>Quick Access ({portal.defaultUser.name})</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Step 2: Credential Verification Box for Selected Portal */}
        <div style={{
          marginTop: '2rem',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={18} color="#C62828" />
                <span>Verify Credentials for {currentPortalConfig.title}</span>
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                SRS FR-01 Authentication: Access restricted strictly to {currentPortalConfig.role} modules.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Demo Pre-fill:</span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setUsername(currentPortalConfig.defaultUser.username);
                  setPassword(currentPortalConfig.defaultUser.password);
                }}
              >
                {currentPortalConfig.defaultUser.username} / {currentPortalConfig.defaultUser.password}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #ef4444',
              color: '#b91c1c',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
              fontWeight: 500
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={14} />
                <span>Username</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Key size={14} />
                <span>Password</span>
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.5rem', height: '42px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>Sign In</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="btn btn-secondary btn-sm"
              style={{ background: '#ffffff', color: '#C62828', borderColor: '#E8E8E8' }}
            >
              ← Back to Home
            </button>
          )}
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            GAMEVERSE CENTRALIZED GAMING CAFÉ MANAGEMENT SYSTEM • WINDOWS 10/11 LAN ENVIRONMENT
          </div>
        </div>
      </div>
    </div>
  );
}
