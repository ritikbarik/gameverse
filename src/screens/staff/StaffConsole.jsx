import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  PlaySquare,
  CalendarCheck,
  Coffee,
  Receipt,
  Package,
  AlertTriangle,
  Monitor,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

// Reusable operational components
import CustomerManagement from '../receptionist/CustomerManagement';
import ReceptionistReservations from '../receptionist/ReceptionistReservations';
import ReceptionistSessions from '../receptionist/ReceptionistSessions';
import ReceptionistBilling from '../receptionist/ReceptionistBilling';
import CafeOrders from '../cafe/CafeOrders';
import CafeInventory from '../cafe/CafeInventory';

export default function StaffConsole({ onOpenReceipt, onNavigate }) {
  const {
    stations,
    sessions,
    orders,
    bills,
    inventory,
    startSession
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');

  const activeSessions = sessions.filter(s => s.end_time === null);
  const pendingOrders = orders.filter(o => o.order_status === 'Pending');
  const unpaidBills = bills.filter(b => b.payment_status === 'Pending');
  const lowStockItems = inventory.filter(i => i.quantity_in_stock <= i.reorder_level);
  const freeStations = stations.filter(s => s.status === 'Free');

  const handleStartSessionDirect = (reservation) => {
    startSession({
      reservation_id: reservation.reservation_id,
      customer_id: reservation.customer_id,
      customer_name: reservation.customer_name,
      station_id: reservation.station_id
    });
    setActiveTab('sessions');
  };

  return (
    <div>
      {/* Staff Operations Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">STAFF OPERATIONS PORTAL</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Front Desk & Café Floor Terminal
            </span>
          </div>
          <h1 style={{ fontSize: '1.65rem' }}>Operations Command Center</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'sessions' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('sessions')}
          >
            Active Sessions ({activeSessions.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'cafe_orders' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('cafe_orders')}
          >
            Café Orders ({pendingOrders.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'billing' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('billing')}
          >
            Billing ({unpaidBills.length})
          </button>
        </div>
      </div>

      {/* Operations Quick Tab Navigation */}
      <div className="staff-subtabs-nav">
        <button
          className={`staff-subtab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Operations Overview
        </button>
        <button
          className={`staff-subtab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          Customer Directory
        </button>
        <button
          className={`staff-subtab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          Reservations
        </button>
        <button
          className={`staff-subtab-btn ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          Live Gaming Sessions
        </button>
        <button
          className={`staff-subtab-btn ${activeTab === 'cafe_orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('cafe_orders')}
        >
          Café Orders
        </button>
        <button
          className={`staff-subtab-btn ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          Billing & Payments
        </button>
        <button
          className={`staff-subtab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Stock & Inventory
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div>
          {/* Key Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card" onClick={() => setActiveTab('sessions')} style={{ cursor: 'pointer' }}>
              <div className="metric-header">
                <span className="metric-title">Active Gaming Sessions</span>
                <PlaySquare size={20} color="var(--accent-blue)" />
              </div>
              <div className="metric-value">{activeSessions.length}</div>
              <div className="metric-footer">
                <span>{stations.length - freeStations.length} of {stations.length} stations in use</span>
              </div>
            </div>

            <div className="metric-card" onClick={() => setActiveTab('cafe_orders')} style={{ cursor: 'pointer' }}>
              <div className="metric-header">
                <span className="metric-title">Pending Café Orders</span>
                <Coffee size={20} color="var(--accent-cyan)" />
              </div>
              <div className="metric-value">{pendingOrders.length}</div>
              <div className="metric-footer">
                <span>Total café orders: {orders.length}</span>
              </div>
            </div>

            <div className="metric-card" onClick={() => setActiveTab('billing')} style={{ cursor: 'pointer' }}>
              <div className="metric-header">
                <span className="metric-title">Unsettled Invoices</span>
                <Receipt size={20} color="var(--accent-amber)" />
              </div>
              <div className="metric-value">{unpaidBills.length}</div>
              <div className="metric-footer">
                <span>Ready for payment processing</span>
              </div>
            </div>

            <div className="metric-card" onClick={() => setActiveTab('inventory')} style={{ cursor: 'pointer' }}>
              <div className="metric-header">
                <span className="metric-title">Low Stock Warnings</span>
                <Package size={20} color={lowStockItems.length > 0 ? "var(--accent-rose)" : "var(--accent-emerald)"} />
              </div>
              <div className="metric-value" style={{ color: lowStockItems.length > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                {lowStockItems.length}
              </div>
              <div className="metric-footer">
                <span>Items at or below reorder threshold</span>
              </div>
            </div>
          </div>

          {/* Quick Action Station & Live Grid */}
          <div className="grid-2-cols" style={{ marginTop: '1.5rem' }}>
            {/* Live Stations Snapshot */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.125rem' }}>Gaming Stations Snapshot</h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {freeStations.length} available for walk-in or booking
                  </p>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('sessions')}
                >
                  Manage Sessions
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {stations.map(st => {
                  const isOcc = st.status === 'Occupied';
                  const isMaint = st.status === 'Maintenance';
                  return (
                    <div
                      key={st.station_id}
                      style={{
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid',
                        borderColor: isOcc ? '#FFCDD2' : isMaint ? '#FFE0B2' : '#C8E6C9',
                        backgroundColor: isOcc ? '#FFEBEE' : isMaint ? '#FFF3E0' : '#E8F5E9',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        {st.station_id}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>
                        {st.station_type} • ₹{st.hourly_rate.toFixed(2)}/h
                      </div>
                      <span className={`badge ${isOcc ? 'badge-occupied' : isMaint ? 'badge-maintenance' : 'badge-free'}`} style={{ fontSize: '0.625rem', padding: '0.15rem 0.4rem' }}>
                        {st.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Urgent Low Stock Alerts */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.125rem' }}>Stock & Reorder Watchlist</h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    FR-07 inventory items requiring replenishment
                  </p>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('inventory')}
                >
                  Update Stock
                </button>
              </div>

              {lowStockItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
                  <p style={{ fontWeight: 600 }}>All inventory items are above reorder levels.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {lowStockItems.map(item => (
                    <div
                      key={item.item_id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: '#fff1f2',
                        border: '1px solid #fecaca'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <AlertTriangle size={18} color="#ef4444" />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.item_name}</div>
                          <div style={{ fontSize: '0.6875rem', color: '#dc2626' }}>
                            Category: {item.category} • Reorder threshold: {item.reorder_level}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: '#dc2626' }}>
                          {item.quantity_in_stock} left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'customers' && <CustomerManagement />}
      {activeTab === 'reservations' && (
        <ReceptionistReservations onStartSessionDirect={handleStartSessionDirect} />
      )}
      {activeTab === 'sessions' && (
        <ReceptionistSessions onOpenReceipt={onOpenReceipt} onNavigate={(scr) => {
          if (scr === 'receptionist_billing') setActiveTab('billing');
        }} />
      )}
      {activeTab === 'cafe_orders' && <CafeOrders />}
      {activeTab === 'billing' && <ReceptionistBilling onOpenReceipt={onOpenReceipt} />}
      {activeTab === 'inventory' && <CafeInventory />}
    </div>
  );
}
