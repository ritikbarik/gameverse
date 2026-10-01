import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarCheck, AlertCircle, CheckCircle2, Monitor, Tv, Clock } from 'lucide-react';

export default function CustomerReservation({ preselectedStationId, preselectedType }) {
  const { currentUser, stations, reservations, createReservation } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const [stationType, setStationType] = useState(preselectedType || 'ALL');
  const [stationId, setStationId] = useState(preselectedStationId || '');
  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [feedback, setFeedback] = useState(null);

  // Filter stations based on stationType and status (FR-03: "Do NOT allow reservation of unavailable stations")
  const availableStations = stations.filter(s => {
    if (s.status !== 'Free') return false; // Available stations only
    if (stationType !== 'ALL' && s.station_type !== stationType) return false;
    return true;
  });

  const myReservations = reservations.filter(r => r.customer_id === currentUser.user_id);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!stationId) {
      setFeedback({ type: 'error', message: 'Please select an available gaming station.' });
      return;
    }
    if (!date || !startTime || !endTime) {
      setFeedback({ type: 'error', message: 'Please specify the date, start time, and end time.' });
      return;
    }
    if (startTime >= endTime) {
      setFeedback({ type: 'error', message: 'End time must be later than start time.' });
      return;
    }

    const res = createReservation({
      customer_id: currentUser.user_id,
      customer_name: currentUser.name,
      station_id: stationId,
      date,
      start_time: startTime,
      end_time: endTime,
      station_type: stationType
    });

    if (res.success) {
      setFeedback({
        type: 'success',
        message: `Reservation confirmed! Confirmation ID: ${res.reservation.reservation_id} for Station ${res.reservation.station_id}.`
      });
      setStationId('');
    } else {
      setFeedback({ type: 'error', message: res.message || 'Reservation could not be created.' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CalendarCheck size={24} color="var(--accent-cyan)" />
            Gaming Station Reservation (FR-03)
          </h1>
          <div className="page-subtitle">
            Reserve an available PC or Console station in advance
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
        {/* Reservation Form */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
            New Reservation Request
          </h2>

          {feedback && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
              background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`,
              color: feedback.type === 'success' ? '#34d399' : '#f87171'
            }}>
              {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Customer ID / Name</label>
              <input
                type="text"
                className="form-control"
                value={`${currentUser.user_id} - ${currentUser.name}`}
                disabled
              />
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
                  <option value="PC">PC Stations (₹80.00/hr)</option>
                  <option value="Console">Console Stations (₹120.00/hr)</option>
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
                  <option value="">-- Select Available Station --</option>
                  {availableStations.map(st => (
                    <option key={st.station_id} value={st.station_id}>
                      {st.station_id} ({st.station_type}) - ₹{Number(st.hourly_rate).toFixed(2)}/hr
                    </option>
                  ))}
                </select>
                {availableStations.length === 0 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginTop: '0.35rem' }}>
                    No stations are currently free in this category.
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Desired Date</label>
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

            <button
              type="submit"
              className="btn btn-cyan"
              style={{ width: '100%', marginTop: '0.75rem' }}
              disabled={availableStations.length === 0}
            >
              <CalendarCheck size={16} />
              Confirm Reservation Request
            </button>
          </form>
        </div>

        {/* Existing Reservations */}
        <div>
          <div className="table-container">
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: '1.05rem' }}>My Reservation History</h2>
            </div>
            {myReservations.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                You have no active or previous reservations on record.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Res ID</th>
                    <th>Station</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myReservations.map(res => (
                    <tr key={res.reservation_id}>
                      <td className="table-code">{res.reservation_id}</td>
                      <td><strong>{res.station_id}</strong></td>
                      <td>{res.date}</td>
                      <td>{res.start_time} - {res.end_time}</td>
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
    </div>
  );
}
