import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Monitor, Tv, CheckCircle2, Clock, AlertTriangle, CalendarCheck } from 'lucide-react';

export default function StationAvailability({ onSelectForReservation }) {
  const { stations } = useApp();
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredStations = stations.filter(s => {
    if (typeFilter !== 'ALL' && s.station_type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Free':
        return <span className="badge badge-free"><CheckCircle2 size={12} /> Free</span>;
      case 'Occupied':
        return <span className="badge badge-occupied"><Clock size={12} /> Occupied</span>;
      case 'Maintenance':
        return <span className="badge badge-maintenance"><AlertTriangle size={12} /> Maintenance</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Monitor size={24} color="var(--accent-cyan)" />
            Station Availability
          </h1>
          <div className="page-subtitle">
            Live real-time status of all gaming stations across the café network
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-bar">
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Type Filter:
        </span>
        <button
          className={`filter-chip ${typeFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setTypeFilter('ALL')}
        >
          All Types ({stations.length})
        </button>
        <button
          className={`filter-chip ${typeFilter === 'PC' ? 'active' : ''}`}
          onClick={() => setTypeFilter('PC')}
        >
          PC Stations
        </button>
        <button
          className={`filter-chip ${typeFilter === 'Console' ? 'active' : ''}`}
          onClick={() => setTypeFilter('Console')}
        >
          Console Stations
        </button>

        <span style={{ margin: '0 0.5rem', color: 'var(--border-subtle)' }}>|</span>

        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Status:
        </span>
        <button
          className={`filter-chip ${statusFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setStatusFilter('ALL')}
        >
          All Statuses
        </button>
        <button
          className={`filter-chip ${statusFilter === 'Free' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Free')}
        >
          Free Only
        </button>
        <button
          className={`filter-chip ${statusFilter === 'Occupied' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Occupied')}
        >
          Occupied
        </button>
        <button
          className={`filter-chip ${statusFilter === 'Maintenance' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Maintenance')}
        >
          Maintenance
        </button>
      </div>

      {/* Stations Grid */}
      <div className="station-grid">
        {filteredStations.map(st => (
          <div key={st.station_id} className={`station-card status-${st.status.toLowerCase()}`}>
            <div>
              <div className="station-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {st.station_type === 'PC' ? (
                    <Monitor size={20} color="var(--accent-cyan)" />
                  ) : (
                    <Tv size={20} color="var(--accent-indigo)" />
                  )}
                  <div className="station-id">{st.station_id}</div>
                </div>
                {getStatusBadge(st.status)}
              </div>

              <div className="station-meta-row">
                <span>Hardware Type:</span>
                <strong style={{ color: 'var(--text-main)' }}>{st.station_type}</strong>
              </div>

              <div className="station-meta-row">
                <span>Hourly Rate:</span>
                <strong style={{ color: 'var(--accent-emerald)', fontSize: '0.95rem' }}>
                  ₹{Number(st.hourly_rate).toFixed(2)} / hr
                </strong>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              {st.status === 'Free' ? (
                <button
                  className="btn btn-cyan btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => onSelectForReservation(st.station_id, st.station_type)}
                >
                  <CalendarCheck size={14} />
                  Reserve This Station
                </button>
              ) : st.status === 'Occupied' ? (
                <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} disabled>
                  Currently In Session
                </button>
              ) : (
                <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} disabled>
                  Hardware Maintenance
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
