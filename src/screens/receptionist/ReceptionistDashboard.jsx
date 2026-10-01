import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CalendarCheck,
  Monitor,
  PlaySquare,
  Receipt,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function ReceptionistDashboard({ onNavigate, onOpenReceipt }) {
  const { users, stations, reservations, sessions, bills } = useApp();

  const customerCount = users.filter(u => u.role === 'Customer').length;
  const freeStations = stations.filter(s => s.status === 'Free').length;
  const occupiedStations = stations.filter(s => s.status === 'Occupied').length;
  const activeSessions = sessions.filter(s => s.status === 'Active');
  const pendingReservations = reservations.filter(r => r.status === 'Confirmed' || r.status === 'Pending');
  const unpaidBills = bills.filter(b => b.payment_status === 'Unpaid');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span style={{ color: 'var(--accent-cyan)' }}>Reception Desk</span> — Front Counter Operations
          </h1>
          <div className="page-subtitle">
            Manage customer intake, station reservations, gameplay sessions, and billing
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => onNavigate('receptionist_sessions')}>
            <PlaySquare size={16} />
            Start Session
          </button>
          <button className="btn btn-cyan" onClick={() => onNavigate('receptionist_reservations')}>
            <CalendarCheck size={16} />
            New Reservation
          </button>
        </div>
      </div>

      {/* Reception Overview Stat Cards */}
      <div className="grid-cards">
        <div className="card">
          <div className="card-title">
            <span>Customer Records</span>
            <Users size={18} color="var(--accent-cyan)" />
          </div>
          <div className="card-value">{customerCount}</div>
          <div className="card-hint">Registered café patrons</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Station Availability</span>
            <Monitor size={18} color="var(--accent-emerald)" />
          </div>
          <div className="card-value" style={{ color: 'var(--accent-emerald)' }}>
            {freeStations} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ {stations.length} Free</span>
          </div>
          <div className="card-hint">{occupiedStations} currently occupied</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Active Sessions</span>
            <PlaySquare size={18} color="var(--accent-amber)" />
          </div>
          <div className="card-value" style={{ color: 'var(--accent-amber)' }}>
            {activeSessions.length}
          </div>
          <div className="card-hint">Players currently in game</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Unpaid Invoices</span>
            <Receipt size={18} color="var(--accent-rose)" />
          </div>
          <div className="card-value" style={{ color: 'var(--accent-rose)' }}>
            {unpaidBills.length}
          </div>
          <div className="card-hint">Pending counter payment</div>
        </div>
      </div>

      {/* Two Column Layout: Active Sessions & Today's Reservations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Active Sessions Panel */}
        <div className="table-container">
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem' }}>Active Gaming Sessions</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('receptionist_sessions')}>
              Manage All
            </button>
          </div>
          {activeSessions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No active sessions at the moment.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Station</th>
                  <th>Customer</th>
                  <th>Started</th>
                  <th>Est. Charge</th>
                </tr>
              </thead>
              <tbody>
                {activeSessions.map(ses => (
                  <tr key={ses.session_id}>
                    <td className="table-code">{ses.session_id}</td>
                    <td><strong style={{ color: 'var(--accent-cyan)' }}>{ses.station_id}</strong></td>
                    <td>{ses.customer_name}</td>
                    <td>{new Date(ses.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-amber)' }}>
                      ₹{Number(ses.session_charge).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pending Reservations Panel */}
        <div className="table-container">
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem' }}>Upcoming Reservations</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('receptionist_reservations')}>
              View Bookings
            </button>
          </div>
          {pendingReservations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No upcoming reservations pending.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Res ID</th>
                  <th>Customer</th>
                  <th>Station</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingReservations.map(res => (
                  <tr key={res.reservation_id}>
                    <td className="table-code">{res.reservation_id}</td>
                    <td>{res.customer_name}</td>
                    <td><strong>{res.station_id}</strong></td>
                    <td>{res.date} ({res.start_time})</td>
                    <td>
                      <span className={`badge badge-${res.status.toLowerCase()}`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
