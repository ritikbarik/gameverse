import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gamepad2,
  Users,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
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
      tagColor: '#E50914',
      tagBg: 'rgba(229, 9, 20, 0.12)',
      icon: Gamepad2,
      desc: 'Browse real-time station availability, reserve PC/Console/VR setups, order café snacks and gaming gear, and track live session bills.',
      features: ['Station Availability', 'Reservations', 'Café & Gear Orders', 'Itemized Bills'],
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
      title: 'Café Staff & Receptionist',
      role: 'Staff',
      tag: 'Merged Operations Desk',
      tagColor: '#E50914',
      tagBg: 'rgba(229, 9, 20, 0.12)',
      icon: Users,
      desc: 'Merged operations for front desk and café floor: customer check-ins, reservations, active session tracking, food orders, and billing.',
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
      tagColor: '#E50914',
      tagBg: 'rgba(229, 9, 20, 0.12)',
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
        {/* Back to Landing navigation button */}
        {onBackToLanding && (
          <div style={{ marginBottom: '1.25rem' }}>
            <button
              onClick={onBackToLanding}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 700,
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <ArrowLeft size={15} />
              <span>← Return to Landing Page</span>
            </button>
          </div>
        )}

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            borderRadius: '18px',
            background: '#E50914',
            boxShadow: '0 8px 24px rgba(229, 9, 20, 0.4)',
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
            color: '#E50914',
            fontWeight: 700,
            marginTop: '0.75rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
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
                  <Icon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div className="portal-title">{portal.title}</div>
                    <span className="badge" style={{
                      backgroundColor: portal.tagBg,
                      color: portal.tagColor,
                      borderColor: portal.tagColor,
                      fontSize: '0.65rem'
                    }}>
                      {portal.tag}
                    </span>
                  </div>
                  <div className="portal-desc">{portal.desc}</div>
                  <div className="portal-features">
                    {portal.features.map(f => (
                      <span key={f} className="portal-pill">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step 2: Login Form for Selected Portal */}
        <div className="card login-form-card" style={{ maxWidth: '560px', margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>
                Authenticating Into
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {currentPortalConfig.title}
              </h2>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin(currentPortalConfig)}
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                borderColor: currentPortalConfig.tagColor,
                color: currentPortalConfig.tagColor
              }}
              title="Quick demo access with pre-filled test credentials"
            >
              <Sparkles size={13} />
              <span>One-Click Demo Entry</span>
            </button>
          </div>

          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
              background: 'rgba(229, 9, 20, 0.12)',
              border: '1px solid rgba(229, 9, 20, 0.35)',
              color: '#ff4d4f'
            }}>
              <ShieldAlert size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Username</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Demo: {currentPortalConfig.defaultUser.username}</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter system username"
                  required
                />
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Password</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Demo: {currentPortalConfig.defaultUser.password}</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter portal password"
                  required
                />
                <Key size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                marginTop: '0.5rem',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.25)'
              }}
            >
              <span>Authenticate & Enter Portal</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Switcher Footer */}
          <div style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px dashed var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '0.45rem' }}>Switch Demo Account:</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              {portals.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePortalSelect(p)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.6rem',
                    background: selectedPortal === p.id ? 'var(--blue-light)' : '#ffffff',
                    color: selectedPortal === p.id ? 'var(--blue-primary)' : 'var(--text-secondary)',
                    borderColor: selectedPortal === p.id ? 'var(--blue-border)' : 'var(--border-subtle)'
                  }}
                >
                  {p.title.split(' ')[0]} ({p.defaultUser.username})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
