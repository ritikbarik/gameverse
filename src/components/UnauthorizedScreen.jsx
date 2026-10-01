import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function UnauthorizedScreen({ onReturnToDashboard }) {
  const { currentUser } = useApp();

  return (
    <div className="unauthorized-box">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ShieldAlert className="unauthorized-icon" />
      </div>
      <h2 style={{ fontSize: '1.4rem', color: '#f87171', marginBottom: '0.5rem' }}>
        403 — Unauthorized Module Access
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        Access to this operational module is restricted. Your current account role is{' '}
        <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
          {currentUser ? currentUser.role : 'Guest'}
        </span>
        , which does not have permission to view or manipulate these records per SRS Security Policy.
      </p>
      <button className="btn btn-primary" onClick={onReturnToDashboard}>
        <ArrowLeft size={16} />
        Return to Permitted Dashboard
      </button>
    </div>
  );
}
