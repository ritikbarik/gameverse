import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Monitor,
  CalendarCheck,
  PlaySquare,
  Coffee,
  Receipt,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function CustomerDashboard({ onNavigate, onOpenReceipt }) {
  const { currentUser, stations, reservations, sessions, orders, bills } = useApp();

  // Filter records belonging to this customer
  const myReservations = reservations.filter(r => r.customer_id === currentUser.user_id);
  const mySessions = sessions.filter(s => s.customer_id === currentUser.user_id);
  const activeSession = mySessions.find(s => s.status === 'Active');
  const myOrders = orders.filter(o => {
    // orders for any session owned by customer
    return mySessions.some(s => s.session_id === o.session_id);
  });
  const myBills = bills.filter(b => b.customer_id === currentUser.user_id);

  const freeStationsCount = stations.filter(s => s.status === 'Free').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span style={{ color: 'var(--accent-cyan)' }}>Customer Portal</span> — Welcome, {currentUser.name}
          </h1>
          <div className="page-subtitle">
            Customer ID: <strong style={{ color: 'var(--text-main)' }}>{currentUser.user_id}</strong> • Access your gaming stations, reservations, café orders, and billing.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-cyan" onClick={() => onNavigate('customer_reservation')}>
            <CalendarCheck size={16} />
            Book a Gaming Station
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid-cards">
        <div className="card">
          <div className="card-title">
            <span>Available Stations</span>
            <Monitor size={18} color="var(--accent-emerald)" />
          </div>
          <div className="card-value" style={{ color: 'var(--accent-emerald)' }}>
            {freeStationsCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ {stations.length}</span>
          </div>
          <div className="card-hint">Ready for immediate play or booking</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Active Gaming Session</span>
            <PlaySquare size={18} color={activeSession ? 'var(--accent-amber)' : 'var(--text-muted)'} />
          </div>
          <div className="card-value" style={{ color: activeSession ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
            {activeSession ? activeSession.station_id : 'None'}
          </div>
          <div className="card-hint">
            {activeSession ? `Active on ${activeSession.station_id} • ${activeSession.duration}` : 'No ongoing session'}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>My Bookings</span>
            <CalendarCheck size={18} color="var(--accent-cyan)" />
          </div>
          <div className="card-value">{myReservations.length}</div>
          <div className="card-hint">Confirmed & past reservations</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Unpaid Balance</span>
            <Receipt size={18} color="var(--accent-rose)" />
          </div>
          <div className="card-value" style={{ color: 'var(--accent-rose)' }}>
            ₹{myBills.filter(b => b.payment_status === 'Unpaid').reduce((sum, b) => sum + b.total_amount, 0).toFixed(2)}
          </div>
          <div className="card-hint">Pending café & session bills</div>
        </div>
      </div>

      {/* Active Session Notice Banner */}
      {activeSession && (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(6, 182, 212, 0.1))',
            borderColor: 'var(--accent-amber)',
            marginBottom: '1.75rem',
            padding: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-occupied">ACTIVE SESSION IN PROGRESS</span>
                <span className="table-code">{activeSession.session_id}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>
                Gaming at Station <strong style={{ color: 'var(--accent-cyan)' }}>{activeSession.station_id}</strong>
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Started: {new Date(activeSession.start_time).toLocaleTimeString()} • Current estimated charge: ₹{Number(activeSession.session_charge).toFixed(2)}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-cyan" onClick={() => onNavigate('customer_cafe')}>
                <Coffee size={16} />
                Order Café Food/Drink
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate('customer_sessions')}>
                Session Details
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Reservations & Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Reservations Table */}
        <div className="table-container">
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem' }}>My Reservations</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('customer_reservation')}>
              View All
            </button>
          </div>
          {myReservations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No reservations found. Book an available station anytime!
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Res ID</th>
                  <th>Station</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myReservations.slice(0, 5).map(res => (
                  <tr key={res.reservation_id}>
                    <td className="table-code">{res.reservation_id}</td>
                    <td><strong>{res.station_id}</strong></td>
                    <td>
                      <div>{res.date}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {res.start_time} - {res.end_time}
                      </div>
                    </td>
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

        {/* Recent Café Orders Table */}
        <div className="table-container">
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem' }}>My Café Orders</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('customer_cafe')}>
              Order Items
            </button>
          </div>
          {myOrders.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No café orders placed yet.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.slice(0, 5).map(ord => (
                  <tr key={ord.order_id}>
                    <td className="table-code">{ord.order_id}</td>
                    <td>{ord.item_name}</td>
                    <td>{ord.quantity}x</td>
                    <td style={{ fontWeight: 600 }}>₹{Number(ord.amount).toFixed(2)}</td>
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
