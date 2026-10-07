import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Monitor,
  Users,
  CalendarCheck,
  PlaySquare,
  DollarSign,
  Coffee,
  Package,
  FileBarChart,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  ShoppingBag
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const {
    users,
    stations,
    reservations,
    sessions,
    orders,
    bills,
    inventory,
    startSession,
    updateOrderStatus
  } = useApp();

  const freeStations = stations.filter(s => s.status === 'Free').length;
  const occupiedStations = stations.filter(s => s.status === 'Occupied').length;
  const maintenanceStations = stations.filter(s => s.status === 'Maintenance').length;
  const activeSessionsList = sessions.filter(s => s.status === 'Active');

  const totalGamingRev = bills.reduce((sum, b) => sum + Number(b.session_charge), 0);
  const totalCafeRev = bills.reduce((sum, b) => sum + Number(b.cafe_charge), 0);
  const totalRev = totalGamingRev + totalCafeRev;

  // Active reservations that require attention
  const activeReservations = reservations.filter(
    r => r.status === 'Confirmed' || r.status === 'Active'
  );

  // Food orders across all active sessions
  const pendingFoodOrders = orders.filter(
    o => o.order_status === 'Pending' || o.order_status === 'Pending Delivery'
  );

  const handleStartSessionFromReservation = (res) => {
    startSession({
      reservation_id: res.reservation_id,
      customer_id: res.customer_id,
      customer_name: res.customer_name,
      station_id: res.station_id
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary">ADMINISTRATOR CONSOLE</span>
          </div>
          <h1 className="page-title">
            Administrator Console — System Overview
          </h1>
          <div className="page-subtitle">
            Centralized monitoring of customer bookings, active sessions, food demands, and café inventory
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => onNavigate('admin_reports')}>
            <FileBarChart size={16} />
            Generate System Reports
          </button>
        </div>
      </div>

      {/* Admin KPI Stat Cards */}
      <div className="grid-cards">
        <div className="card">
          <div className="card-title">
            <span>Total Gaming Stations</span>
            <Monitor size={18} color="#C62828" />
          </div>
          <div className="card-value">{stations.length}</div>
          <div className="card-hint">
            {freeStations} Free • {occupiedStations} Occupied • {maintenanceStations} Maint.
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Total Revenue</span>
            <DollarSign size={18} color="#2E7D32" />
          </div>
          <div className="card-value" style={{ color: 'var(--accent-emerald)' }}>
            ₹{totalRev.toFixed(2)}
          </div>
          <div className="card-hint">
            Gaming: ₹{totalGamingRev.toFixed(2)} | Café: ₹{totalCafeRev.toFixed(2)}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Active Gameplay Sessions</span>
            <PlaySquare size={18} color="#C62828" />
          </div>
          <div className="card-value" style={{ color: '#C62828' }}>
            {activeSessionsList.length}
          </div>
          <div className="card-hint">Live stations currently in use</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Pending Food Demands</span>
            <Coffee size={18} color="#E65100" />
          </div>
          <div className="card-value" style={{ color: pendingFoodOrders.length > 0 ? '#E65100' : 'var(--text-main)' }}>
            {pendingFoodOrders.length}
          </div>
          <div className="card-hint">Active station refreshment requests</div>
        </div>
      </div>

      {/* =========================================================================
          LIVE FIREBASE SYNC: CUSTOMER BOOKINGS & FOOD DEMANDS SECTIONS
          ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* 1. Live Customer Bookings & Reservations Feed */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '1.15rem 1.35rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-elevated)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <CalendarCheck size={18} color="var(--red-primary)" />
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Live Customer Bookings
                </h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Real-time station reservations booked by customers
                </div>
              </div>
            </div>
            <span className="badge badge-primary">{activeReservations.length} Active</span>
          </div>

          <div style={{ padding: '1rem', maxHeight: '380px', overflowY: 'auto' }}>
            {activeReservations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <CalendarCheck size={32} color="#C62828" style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                <p style={{ fontWeight: 600 }}>No active customer bookings right now.</p>
                <div style={{ fontSize: '0.75rem' }}>When a customer books a station, it will appear here in real time.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeReservations.map(res => {
                  const isConfirmed = res.status === 'Confirmed';
                  return (
                    <div
                      key={res.reservation_id}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-elevated)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{res.customer_name}</strong>
                          <span className="table-code" style={{ fontSize: '0.7rem' }}>{res.reservation_id}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          Station: <strong>{res.station_id}</strong> ({res.station_type}) • {res.date} ({res.start_time} - {res.end_time})
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span className={`badge ${isConfirmed ? 'badge-free' : 'badge-occupied'}`}>
                          {res.status}
                        </span>
                        {isConfirmed && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleStartSessionFromReservation(res)}
                            title="Start gameplay session for this reservation"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                          >
                            <span>Start Session</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 2. Active Sessions & Live Customer Food Demands Feed */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '1.15rem 1.35rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-elevated)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Coffee size={18} color="var(--red-primary)" />
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Active Sessions & Food Demands
                </h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Live station player sessions & ordered refreshments
                </div>
              </div>
            </div>
            <span className="badge badge-free">{activeSessionsList.length} In Play</span>
          </div>

          <div style={{ padding: '1rem', maxHeight: '380px', overflowY: 'auto' }}>
            {activeSessionsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <PlaySquare size={32} color="#C62828" style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                <p style={{ fontWeight: 600 }}>No active player sessions in progress.</p>
                <div style={{ fontSize: '0.75rem' }}>Active sessions and food demands will stream here in real time.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {activeSessionsList.map(ses => {
                  // Get food demands for this session
                  const sessionFoodDemands = orders.filter(o => o.session_id === ses.session_id);
                  return (
                    <div
                      key={ses.session_id}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-elevated)'
                      }}
                    >
                      {/* Session Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span className="badge badge-occupied" style={{ fontSize: '0.7rem' }}>
                              Station {ses.station_id}
                            </span>
                            <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{ses.customer_name}</strong>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            Session ID: {ses.session_id} • Started: {new Date(ses.start_time).toLocaleTimeString()}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--red-primary)' }}>
                          ₹{Number(ses.session_charge).toFixed(2)}/hr
                        </span>
                      </div>

                      {/* Food Demands For This Player */}
                      <div style={{
                        marginTop: '0.65rem',
                        padding: '0.65rem 0.85rem',
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <ShoppingBag size={12} color="var(--red-primary)" />
                          <span>Player Food Demands ({sessionFoodDemands.length})</span>
                        </div>

                        {sessionFoodDemands.length === 0 ? (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No food demands placed yet during this session.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {sessionFoodDemands.map(fd => {
                              const isDelivered = fd.order_status === 'Delivered to Station' || fd.order_status === 'Delivered';
                              return (
                                <div
                                  key={fd.order_id}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.78rem',
                                    padding: '0.35rem 0.5rem',
                                    borderRadius: '4px',
                                    background: 'var(--bg-elevated)',
                                    border: '1px solid var(--border-subtle)'
                                  }}
                                >
                                  <div>
                                    <strong style={{ color: 'var(--text-main)' }}>{fd.quantity}x {fd.item_name}</strong>
                                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                                      (₹{Number(fd.amount).toFixed(2)})
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className={`badge ${isDelivered ? 'badge-free' : 'badge-maintenance'}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                                      {isDelivered ? 'Delivered' : 'Pending Prep'}
                                    </span>
                                    {!isDelivered && (
                                      <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => updateOrderStatus(fd.order_id, 'Delivered to Station')}
                                        style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}
                                        title="Mark food as delivered to customer station"
                                      >
                                        Mark Delivered
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Station Status Monitor Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem' }}>Current Gaming Station Status (FR-02)</h2>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Real-time hardware availability and player occupancy
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('admin_stations')}>
            Manage Stations
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="station-grid">
          {stations.map(st => (
            <div key={st.station_id} className={`station-card status-${st.status.toLowerCase()}`}>
              <div>
                <div className="station-card-header">
                  <span className="station-id">{st.station_id}</span>
                  <span className={`badge badge-${st.status.toLowerCase()}`}>{st.status}</span>
                </div>
                <div className="station-meta-row">
                  <span>Type:</span>
                  <strong>{st.station_type}</strong>
                </div>
                <div className="station-meta-row">
                  <span>Rate:</span>
                  <strong>₹{Number(st.hourly_rate).toFixed(2)} / hr</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access to Reports */}
      <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileBarChart size={20} color="#C62828" />
              Management Reports Module (FR-08)
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Generate official Revenue Reports, Station-Usage Reports, and Inventory Reports for selected date ranges.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('admin_reports')}>
            Open Reports Center
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
