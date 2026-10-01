import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarCheck, Plus, CheckCircle2, XCircle, PlaySquare, AlertCircle } from 'lucide-react';

export default function ReceptionistReservations({ onStartSessionDirect }) {
  const {
    users,
    stations,
    reservations,
    createReservation,
    updateReservationStatus
  } = useApp();

  const customers = users.filter(u => u.role === 'Customer');

  const [showAddModal, setShowAddModal] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [stationType, setStationType] = useState('ALL');
  const [stationId, setStationId] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('15:00');
  const [endTime, setEndTime] = useState('17:00');
  const [feedback, setFeedback] = useState(null);

  // Available free stations
  const availableStations = stations.filter(s => {
    if (s.status !== 'Free') return false;
    if (stationType !== 'ALL' && s.station_type !== stationType) return false;
    return true;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    setFeedback(null);

    const customer = customers.find(c => c.user_id === customerId);
    const customerName = customer ? customer.name : 'Walk-in Customer';

    const res = createReservation({
      customer_id: customerId || 'USR-WALK',
      customer_name: customerName,
      station_id: stationId,
      date,
      start_time: startTime,
      end_time: endTime,
      station_type: stationType
    });

    if (res.success) {
      setShowAddModal(false);
      setStationId('');
      setCustomerId('');
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CalendarCheck size={24} color="var(--accent-cyan)" />
            Reservation Management (FR-03)
          </h1>
          <div className="page-subtitle">
            Manage advance bookings and verify station availability prior to reservation
          </div>
        </div>
        <button className="btn btn-cyan" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Create New Reservation
        </button>
      </div>

      {/* Reservation Table */}
      <div className="table-container">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.05rem' }}>All System Reservations</h2>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Total Records: {reservations.length}
          </span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Res ID</th>
              <th>Customer</th>
              <th>Station ID</th>
              <th>Date</th>
              <th>Time Window</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => (
              <tr key={res.reservation_id}>
                <td className="table-code">{res.reservation_id}</td>
                <td>
                  <strong style={{ color: 'var(--text-main)' }}>{res.customer_name}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.customer_id}</div>
                </td>
                <td><strong style={{ color: 'var(--accent-cyan)' }}>{res.station_id}</strong></td>
                <td>{res.date}</td>
                <td>{res.start_time} - {res.end_time}</td>
                <td>
                  <span className={`badge badge-${res.status.toLowerCase()}`}>
                    {res.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {res.status === 'Confirmed' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onStartSessionDirect(res)}
                        title="Start active gameplay session"
                      >
                        <PlaySquare size={13} />
                        Start Session
                      </button>
                    )}
                    {res.status === 'Confirmed' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateReservationStatus(res.reservation_id, 'Cancelled')}
                        title="Cancel reservation"
                      >
                        <XCircle size={13} />
                        Cancel
                      </button>
                    )}
                    {res.status === 'Active' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                        In Gameplay
                      </span>
                    )}
                    {(res.status === 'Completed' || res.status === 'Cancelled') && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Archived
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Reservation Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Station Reservation (FR-03)</h3>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                {feedback && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem',
                    marginBottom: '1rem',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #ef4444',
                    color: '#f87171'
                  }}>
                    <AlertCircle size={16} />
                    <span>{feedback.message}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Customer</label>
                  <select
                    className="form-control"
                    value={customerId}
                    onChange={e => setCustomerId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Customer --</option>
                    {customers.map(c => (
                      <option key={c.user_id} value={c.user_id}>
                        {c.name} ({c.user_id}) - {c.phone || c.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Station Hardware Type</label>
                    <select
                      className="form-control"
                      value={stationType}
                      onChange={e => {
                        setStationType(e.target.value);
                        setStationId('');
                      }}
                    >
                      <option value="ALL">All Types</option>
                      <option value="PC">PC Stations (₹80/hr)</option>
                      <option value="Console">Console Stations (₹120/hr)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Available Station</label>
                    <select
                      className="form-control"
                      value={stationId}
                      onChange={e => setStationId(e.target.value)}
                      required
                    >
                      <option value="">-- Select Station --</option>
                      {availableStations.map(st => (
                        <option key={st.station_id} value={st.station_id}>
                          {st.station_id} ({st.station_type}) - ₹{Number(st.hourly_rate).toFixed(2)}/hr
                        </option>
                      ))}
                    </select>
                    {availableStations.length === 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginTop: '0.35rem' }}>
                        No stations currently free in this filter.
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Reservation Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    min={todayStr}
                    onChange={e => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-cyan"
                  disabled={availableStations.length === 0}
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
