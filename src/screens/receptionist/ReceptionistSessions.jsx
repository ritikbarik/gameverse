import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlaySquare, StopCircle, Plus, Clock, Monitor, DollarSign, Receipt } from 'lucide-react';

export default function ReceptionistSessions({ onOpenReceipt, onNavigate }) {
  const {
    users,
    stations,
    reservations,
    sessions,
    orders,
    startSession,
    endSession
  } = useApp();

  const customers = users.filter(u => u.role === 'Customer');
  const freeStations = stations.filter(s => s.status === 'Free');
  const activeSessions = sessions.filter(s => s.status === 'Active');
  const completedSessions = sessions.filter(s => s.status === 'Completed');

  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedStationId, setSelectedStationId] = useState('');
  const [selectedReservationId, setSelectedReservationId] = useState('');

  // End Session modal state
  const [endingSession, setEndingSession] = useState(null);
  const [manualHours, setManualHours] = useState('2.0');

  const handleStartSubmit = (e) => {
    e.preventDefault();
    if (!selectedStationId) return;

    const customer = customers.find(c => c.user_id === selectedCustomerId);
    const customerName = customer ? customer.name : 'Walk-in Customer';

    startSession({
      reservation_id: selectedReservationId || null,
      customer_id: selectedCustomerId || 'USR-WALK',
      customer_name: customerName,
      station_id: selectedStationId
    });

    setShowStartModal(false);
    setSelectedCustomerId('');
    setSelectedStationId('');
    setSelectedReservationId('');
  };

  const handleEndSubmit = (e) => {
    e.preventDefault();
    if (!endingSession) return;

    const createdBill = endSession(endingSession.session_id, parseFloat(manualHours) || 1.5);
    setEndingSession(null);
    if (createdBill && onOpenReceipt) {
      onOpenReceipt(createdBill);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <PlaySquare size={24} color="var(--accent-amber)" />
            Gaming Session Management (FR-04)
          </h1>
          <div className="page-subtitle">
            Start gameplay sessions, track live station usage, calculate durations and gaming charges
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowStartModal(true)}>
          <Plus size={16} />
          Start New Session
        </button>
      </div>

      {/* Active Sessions Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>Active Ongoing Sessions</span>
            <span className="badge badge-occupied">{activeSessions.length} IN PLAY</span>
          </h2>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Stations are marked as <strong>Occupied</strong> while sessions are active
          </span>
        </div>

        {activeSessions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            No sessions are currently active. Click "Start New Session" to seat a customer at an available station.
          </div>
        ) : (
          <div className="station-grid">
            {activeSessions.map(ses => {
              const station = stations.find(s => s.station_id === ses.station_id);
              return (
                <div key={ses.session_id} className="station-card status-occupied">
                  <div>
                    <div className="station-card-header">
                      <div className="station-id" style={{ color: 'var(--accent-cyan)' }}>
                        {ses.station_id}
                      </div>
                      <span className="badge badge-occupied">ACTIVE</span>
                    </div>

                    <div className="station-meta-row">
                      <span>Customer:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{ses.customer_name}</strong>
                    </div>

                    <div className="station-meta-row">
                      <span>Session ID:</span>
                      <span className="table-code">{ses.session_id}</span>
                    </div>

                    <div className="station-meta-row">
                      <span>Started At:</span>
                      <span>{new Date(ses.start_time).toLocaleTimeString()}</span>
                    </div>

                    <div className="station-meta-row">
                      <span>Rate:</span>
                      <strong style={{ color: 'var(--accent-emerald)' }}>
                        ₹{station ? Number(station.hourly_rate).toFixed(2) : '80.00'}/hr
                      </strong>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                    <button
                      className="btn btn-danger"
                      style={{ width: '100%' }}
                      onClick={() => {
                        setEndingSession(ses);
                        setManualHours('2.0');
                      }}
                    >
                      <StopCircle size={15} />
                      End Session & Calculate Bill
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Sessions Table */}
      <div className="table-container">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.05rem' }}>Completed Sessions Log</h2>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Historical completed records ({completedSessions.length})
          </span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Customer</th>
              <th>Station</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Duration</th>
              <th>Gaming Charge</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {completedSessions.map(ses => (
              <tr key={ses.session_id}>
                <td className="table-code">{ses.session_id}</td>
                <td>{ses.customer_name}</td>
                <td><strong>{ses.station_id}</strong></td>
                <td>{new Date(ses.start_time).toLocaleTimeString()}</td>
                <td>{ses.end_time ? new Date(ses.end_time).toLocaleTimeString() : 'N/A'}</td>
                <td>{ses.duration}</td>
                <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  ₹{Number(ses.session_charge).toFixed(2)}
                </td>
                <td>
                  <span className="badge badge-completed">
                    {ses.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Start Session Modal */}
      {showStartModal && (
        <div className="modal-overlay" onClick={() => setShowStartModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Start Gaming Session (FR-04)</h3>
            </div>
            <form onSubmit={handleStartSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Customer (Registered or Walk-in)</label>
                  <select
                    className="form-control"
                    value={selectedCustomerId}
                    onChange={e => setSelectedCustomerId(e.target.value)}
                  >
                    <option value="">-- Walk-in / Unregistered Customer --</option>
                    {customers.map(c => (
                      <option key={c.user_id} value={c.user_id}>
                        {c.name} ({c.user_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Available Free Station</label>
                  <select
                    className="form-control"
                    value={selectedStationId}
                    onChange={e => setSelectedStationId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Free Station --</option>
                    {freeStations.map(st => (
                      <option key={st.station_id} value={st.station_id}>
                        {st.station_id} ({st.station_type}) - ₹{Number(st.hourly_rate).toFixed(2)}/hr
                      </option>
                    ))}
                  </select>
                  {freeStations.length === 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginTop: '0.35rem' }}>
                      All gaming stations are currently occupied or in maintenance!
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Link to Confirmed Reservation (Optional)</label>
                  <select
                    className="form-control"
                    value={selectedReservationId}
                    onChange={e => {
                      setSelectedReservationId(e.target.value);
                      const res = reservations.find(r => r.reservation_id === e.target.value);
                      if (res) {
                        setSelectedStationId(res.station_id);
                        setSelectedCustomerId(res.customer_id);
                      }
                    }}
                  >
                    <option value="">-- No reservation (Direct walk-in) --</option>
                    {reservations.filter(r => r.status === 'Confirmed').map(r => (
                      <option key={r.reservation_id} value={r.reservation_id}>
                        {r.reservation_id} - {r.customer_name} on {r.station_id} ({r.date})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowStartModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={freeStations.length === 0 || !selectedStationId}
                >
                  Begin Gameplay Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* End Session Calculation Modal */}
      {endingSession && (
        <div className="modal-overlay" onClick={() => setEndingSession(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>End Gaming Session & Calculate Bill</h3>
            </div>
            <form onSubmit={handleEndSubmit}>
              <div className="modal-body">
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div className="receipt-row">
                    <span>Session Ref:</span>
                    <strong className="table-code">{endingSession.session_id}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Station:</span>
                    <strong>{endingSession.station_id}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Customer:</span>
                    <strong>{endingSession.customer_name}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Start Timestamp:</span>
                    <span>{new Date(endingSession.start_time).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Recorded Gameplay Duration (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    className="form-control"
                    value={manualHours}
                    onChange={e => setManualHours(e.target.value)}
                    required
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    Calculates session charge = duration × hourly rate. The station will return to <strong>Free</strong> status, and a consolidated bill will be generated.
                  </div>
                </div>

                {/* Café Items Breakdown Preview */}
                {(() => {
                  const sOrders = orders.filter(o => o.session_id === endingSession.session_id);
                  const deliveredO = sOrders.filter(o => o.order_status === 'Delivered' || o.order_status === 'Delivered to Station' || o.delivered);
                  const pendingO = sOrders.filter(o => o.order_status !== 'Delivered' && !o.delivered);
                  const deliveredAmt = deliveredO.reduce((sum, o) => sum + Number(o.amount || 0), 0);
                  const st = stations.find(s => s.station_id === endingSession.station_id);
                  const hRate = st ? st.hourly_rate : 80;
                  const gCharge = Math.round((parseFloat(manualHours) || 0) * hRate * 100) / 100;
                  const finalAmt = Math.round((gCharge + deliveredAmt) * 100) / 100;

                  return (
                    <div style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      marginBottom: '1rem',
                      fontSize: '0.825rem'
                    }}>
                      <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                        Preliminary Billing Preview:
                      </div>
                      <div className="receipt-row">
                        <span>Gaming Charge ({manualHours || 0} hrs @ ₹{hRate}/hr):</span>
                        <strong>₹{gCharge.toFixed(2)}</strong>
                      </div>
                      <div className="receipt-row">
                        <span>Delivered Café Items ({deliveredO.length}):</span>
                        <strong style={{ color: 'var(--accent-emerald)' }}>+₹{deliveredAmt.toFixed(2)}</strong>
                      </div>

                      {pendingO.length > 0 && (
                        <div style={{
                          background: 'rgba(245, 158, 11, 0.12)',
                          border: '1px solid #FCD34D',
                          borderRadius: '4px',
                          padding: '0.4rem 0.6rem',
                          color: '#92400E',
                          fontSize: '0.75rem',
                          margin: '0.5rem 0'
                        }}>
                          ⚠️ <strong>{pendingO.length} café order(s)</strong> are still pending delivery in the kitchen. Per policy, <em>undelivered items are excluded from the bill</em> until confirmed by café.
                        </div>
                      )}

                      <div className="receipt-row" style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Estimated Total Bill:</span>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)' }}>
                          ₹{finalAmt.toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEndingSession(null)}
                >
                  Keep Playing
                </button>
                <button type="submit" className="btn btn-danger">
                  End Session & Produce Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
