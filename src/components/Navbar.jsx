import React from 'react';
import { useApp } from '../context/AppContext';
import { User, LogOut } from 'lucide-react';

export default function Navbar({ onLogout }) {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  const isCustomer = currentUser.role === 'Customer';
  const isStaff = currentUser.role === 'Staff' || currentUser.role === 'Receptionist' || currentUser.role === 'Café Staff';

  const portalTitle = isCustomer
    ? 'CUSTOMER PORTAL'
    : isStaff
    ? 'CAFÉ STAFF & RECEPTIONIST PORTAL'
    : 'ADMINISTRATOR PORTAL';

  const portalBadgeColor = isCustomer
    ? { bg: 'rgba(229, 9, 20, 0.12)', border: 'rgba(229, 9, 20, 0.35)', text: '#ff4d4f' }
    : isStaff
    ? { bg: 'rgba(229, 9, 20, 0.12)', border: 'rgba(229, 9, 20, 0.35)', text: '#ff4d4f' }
    : { bg: 'rgba(229, 9, 20, 0.12)', border: 'rgba(229, 9, 20, 0.35)', text: '#ff4d4f' };

  return (
    <header className="top-header" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.85rem 2rem',
      backgroundColor: 'var(--bg-header)',
      borderBottom: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Left: Portal Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: portalBadgeColor.bg,
          border: `1px solid ${portalBadgeColor.border}`,
          fontSize: '0.75rem',
          fontWeight: 800,
          color: portalBadgeColor.text,
          letterSpacing: '0.05em'
        }}>
          <span>{portalTitle}</span>
        </div>
      </div>

      {/* Right: User Profile & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'rgba(229, 9, 20, 0.12)',
              border: '1px solid rgba(229, 9, 20, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff4d4f'
            }}
          >
            <User size={16} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {isStaff ? 'Café Staff & Receptionist' : currentUser.role} • {currentUser.user_id}
            </div>
          </div>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onLogout}
          style={{
            borderColor: 'rgba(229, 9, 20, 0.35)',
            color: '#ff4d4f',
            background: 'rgba(229, 9, 20, 0.1)',
            fontWeight: 700
          }}
          title="Sign out of GameVerse"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
