import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Monitor, Tv, Plus, Edit2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function StationManagement() {
  const { stations, addStation, updateStation } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);

  const [stationId, setStationId] = useState('');
  const [stationType, setStationType] = useState('PC');
  const [status, setStatus] = useState('Free');
  const [hourlyRate, setHourlyRate] = useState('10.00');

  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredStations = stations.filter(s => {
    if (filterType !== 'ALL' && s.station_type !== filterType) return false;
    if (filterStatus !== 'ALL' && s.status !== filterStatus) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingStation(null);
    setStationId(`STN-PC-${String(stations.length + 1).padStart(2, '0')}`);
    setStationType('PC');
    setStatus('Free');
    setHourlyRate('10.00');
    setShowModal(true);
  };

  const handleOpenEdit = (station) => {
    setEditingStation(station);
    setStationId(station.station_id);
    setStationType(station.station_type);
    setStatus(station.status);
    setHourlyRate(station.hourly_rate.toString());
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!stationId.trim()) return;

    if (editingStation) {
      updateStation(editingStation.station_id, {
        station_type: stationType,
        status: status,
        hourly_rate: parseFloat(hourlyRate) || 10.00
      });
    } else {
      addStation({
        station_id: stationId,
        station_type: stationType,
        status: status,
        hourly_rate: parseFloat(hourlyRate) || 10.00
      });
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Monitor size={24} color="var(--accent-cyan)" />
            Gaming Station Management (FR-02)
          </h1>
          <div className="page-subtitle">
            Configure PC & Console stations, maintain hardware operational status, and set hourly rates
          </div>
        </div>
        <button className="btn btn-cyan" onClick={handleOpenAdd}>
          <Plus size={16} />
          Add Gaming Station
        </button>
      </div>

      {/* Filter Controls */}
      <div className="filter-bar">
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Hardware Type:
        </span>
        <button
          className={`filter-chip ${filterType === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilterType('ALL')}
        >
          All ({stations.length})
        </button>
        <button
          className={`filter-chip ${filterType === 'PC' ? 'active' : ''}`}
          onClick={() => setFilterType('PC')}
        >
          PC Stations
        </button>
        <button
          className={`filter-chip ${filterType === 'Console' ? 'active' : ''}`}
          onClick={() => setFilterType('Console')}
        >
          Console Stations
        </button>

        <span style={{ margin: '0 0.5rem', color: 'var(--border-subtle)' }}>|</span>

        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Status:
        </span>
        <button
          className={`filter-chip ${filterStatus === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilterStatus('ALL')}
        >
          All
        </button>
        <button
          className={`filter-chip ${filterStatus === 'Free' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Free')}
        >
          Free
        </button>
        <button
          className={`filter-chip ${filterStatus === 'Occupied' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Occupied')}
        >
          Occupied
        </button>
        <button
          className={`filter-chip ${filterStatus === 'Maintenance' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Maintenance')}
        >
          Maintenance
        </button>
      </div>

      {/* Stations Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Station ID</th>
              <th>Hardware Type</th>
              <th>Operational Status</th>
              <th>Hourly Rate (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStations.map(st => (
              <tr key={st.station_id}>
                <td className="table-code">{st.station_id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {st.station_type === 'PC' ? <Monitor size={15} color="var(--accent-cyan)" /> : <Tv size={15} color="var(--accent-indigo)" />}
                    <strong>{st.station_type}</strong>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${st.status.toLowerCase()}`}>
                    {st.status}
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  ₹{Number(st.hourly_rate).toFixed(2)} / hr
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenEdit(st)}
                  >
                    <Edit2 size={13} />
                    Modify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Modify Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingStation ? `Modify Station ${editingStation.station_id}` : 'Add New Gaming Station'}</h3>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Station ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={stationId}
                    onChange={e => setStationId(e.target.value)}
                    disabled={!!editingStation}
                    required
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Standard format: STN-PC-XX or STN-CON-XX
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Station Type</label>
                    <select
                      className="form-control"
                      value={stationType}
                      onChange={e => setStationType(e.target.value)}
                    >
                      <option value="PC">PC</option>
                      <option value="Console">Console</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Operational Status</label>
                    <select
                      className="form-control"
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                    >
                      <option value="Free">Free</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Hourly Rate (₹ / hour)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    className="form-control"
                    value={hourlyRate}
                    onChange={e => setHourlyRate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-cyan">
                  {editingStation ? 'Save Station' : 'Create Station'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
