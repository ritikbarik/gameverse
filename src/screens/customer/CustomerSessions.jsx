import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlaySquare, Clock, Coffee, CheckCircle2, ShoppingBag, Plus, AlertCircle } from 'lucide-react';

export default function CustomerSessions() {
  const { currentUser, sessions, stations, inventory, orders, addCafeOrder } = useApp();

  const mySessions = sessions.filter(s => s.customer_id === currentUser.user_id);
  const activeSession = mySessions.find(s => s.status === 'Active');

  const [selectedQty, setSelectedQty] = useState({});
  const [feedback, setFeedback] = useState(null);

  // Available café items from inventory
  const cafeItems = inventory.filter(i => i.category === 'Café Items');

  // Demands placed during current active session
  const activeSessionDemands = activeSession
    ? orders.filter(o => o.session_id === activeSession.session_id)
    : [];

  const handleQuickDemand = (item) => {
    if (!activeSession) {
      setFeedback({ type: 'error', message: 'You must have an active session to demand refreshments.' });
      return;
    }
    const qty = selectedQty[item.item_id] || 1;
    const res = addCafeOrder({
      session_id: activeSession.session_id,
      item_id: item.item_id,
      quantity: qty
    });

    if (res.success) {
      setFeedback({
        type: 'success',
        message: `Food demand sent! ${qty}x ${item.item_name} ordered for Station ${activeSession.station_id}. Real-time synced to Admin & Café staff!`
      });
      // Reset qty
      setSelectedQty(prev => ({ ...prev, [item.item_id]: 1 }));
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Could not place order.' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <PlaySquare size={24} color="#C62828" />
            Gaming Sessions & Food Demands (FR-04 / FR-05)
          </h1>
          <div className="page-subtitle">
            View active gameplay metrics, duration, and demand food delivered directly to your station
          </div>
        </div>
      </div>

      {feedback && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(229, 9, 20, 0.12)',
          border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(229, 9, 20, 0.35)'}`,
          color: feedback.type === 'success' ? '#10b981' : '#ff4d4f'
        }}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Ongoing Live Session & In-Session Food Demands */}
      {activeSession ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Active Session Status Card */}
          <div className="card" style={{ borderTop: '4px solid var(--red-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-occupied">CURRENTLY IN PLAY</span>
                  <span className="table-code">{activeSession.session_id}</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Station {activeSession.station_id}
                </h2>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Session started: {new Date(activeSession.start_time).toLocaleTimeString()}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Estimated Session Charge
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--red-primary)' }}>
                  ₹{Number(activeSession.session_charge).toFixed(2)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Duration: {activeSession.duration}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Live Food Demand Feature (Section Required by User) */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: '8px',
                  background: 'rgba(229, 9, 20, 0.12)',
                  border: '1px solid rgba(229, 9, 20, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--red-primary)'
                }}>
                  <Coffee size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                    Demand Food & Drinks to Station {activeSession.station_id}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Orders sync in real time to the Admin & kitchen console
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Food Items Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {cafeItems.map(item => {
                const inStock = item.quantity_in_stock > 0;
                return (
                  <div
                    key={item.item_id}
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{item.item_name}</strong>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--red-primary)' }}>
                          ₹{Number(item.unit_price).toFixed(2)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.725rem', color: inStock ? 'var(--accent-emerald)' : 'var(--red-primary)', marginTop: '0.25rem' }}>
                        {inStock ? `${item.quantity_in_stock} in kitchen stock` : 'Out of stock'}
                      </div>
                    </div>

                    <div style={{ marginTop: '0.85rem' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleQuickDemand(item)}
                        disabled={!inStock}
                        style={{ width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.65rem' }}
                      >
                        <Plus size={14} />
                        <span>Demand to Station</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Demands for this Active Session */}
            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1rem'
            }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShoppingBag size={14} color="var(--red-primary)" />
                <span>My Active Session Food Demands ({activeSessionDemands.length})</span>
              </h4>

              {activeSessionDemands.length === 0 ? (
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No food demands ordered yet for this active session. Choose any refreshment above to order!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {activeSessionDemands.map(demand => {
                    const isDelivered = demand.order_status === 'Delivered to Station' || demand.order_status === 'Delivered';
                    return (
                      <div
                        key={demand.order_id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <div>
                          <strong style={{ color: 'var(--text-main)' }}>{demand.quantity}x {demand.item_name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                            (₹{Number(demand.amount).toFixed(2)}) • {new Date(demand.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        <span className={`badge ${isDelivered ? 'badge-free' : 'badge-maintenance'}`}>
                          {isDelivered ? '✓ Delivered (Added to Bill)' : '⏳ In Kitchen / Pending Delivery'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={20} color="var(--text-muted)" />
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              No active session currently in play. Book a station or visit the front desk to start playing and unlock in-session food demands.
            </div>
          </div>
        </div>
      )}

      {/* Session Records Table */}
      <div className="table-container">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Past Gaming Sessions</h2>
        </div>
        {mySessions.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No session records on file.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Station</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Session Charge</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mySessions.map(ses => (
                <tr key={ses.session_id}>
                  <td className="table-code">{ses.session_id}</td>
                  <td><strong>{ses.station_id}</strong></td>
                  <td>{new Date(ses.start_time).toLocaleString()}</td>
                  <td>{ses.end_time ? new Date(ses.end_time).toLocaleString() : 'In Progress'}</td>
                  <td>{ses.duration}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    ₹{Number(ses.session_charge).toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge badge-${ses.status === 'Active' ? 'occupied' : 'completed'}`}>
                      {ses.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
