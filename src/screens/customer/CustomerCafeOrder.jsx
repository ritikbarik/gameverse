import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coffee, ShoppingBag, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CustomerCafeOrder() {
  const { currentUser, sessions, inventory, orders, addCafeOrder } = useApp();

  const mySessions = sessions.filter(s => s.customer_id === currentUser.user_id);
  const activeSession = mySessions.find(s => s.status === 'Active');

  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState(null);

  // Café items only
  const cafeItems = inventory.filter(i => i.category === 'Café Items');
  const selectedItem = cafeItems.find(i => i.item_id === selectedItemId);

  // Orders for this customer's active session
  const activeSessionOrders = activeSession
    ? orders.filter(o => o.session_id === activeSession.session_id)
    : [];

  const handleOrder = (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!activeSession) {
      setFeedback({ type: 'error', message: 'You must have an active gaming session to place café orders.' });
      return;
    }
    if (!selectedItemId) {
      setFeedback({ type: 'error', message: 'Please select a café item.' });
      return;
    }
    if (!quantity || quantity < 1) {
      setFeedback({ type: 'error', message: 'Quantity must be at least 1.' });
      return;
    }

    const res = addCafeOrder({
      session_id: activeSession.session_id,
      item_id: selectedItemId,
      quantity
    });

    if (res.success) {
      setFeedback({
        type: 'success',
        message: `Order confirmed! ${quantity}x ${selectedItem.item_name} (₹${res.order.amount.toFixed(2)}) recorded for your session.`
      });
      setQuantity(1);
      setSelectedItemId('');
    } else {
      setFeedback({ type: 'error', message: res.message || 'Order could not be recorded.' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Coffee size={24} color="var(--accent-cyan)" />
            Café Food & Beverage Orders (FR-05)
          </h1>
          <div className="page-subtitle">
            Order refreshments delivered directly to your gaming station
          </div>
        </div>
      </div>

      {!activeSession && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid var(--accent-amber)',
          borderRadius: 'var(--radius-md)',
          color: '#fbbf24',
          marginBottom: '1.75rem',
          fontSize: '0.875rem'
        }}>
          <AlertTriangle size={20} />
          <span>
            You do not currently have an active gaming session. Café orders can only be placed against an active station session.
          </span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.75rem' }}>
        {/* Order Form */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
            Place Café Refreshment Order
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

          <form onSubmit={handleOrder}>
            <div className="form-group">
              <label className="form-label">Active Session & Station</label>
              <input
                type="text"
                className="form-control"
                value={
                  activeSession
                    ? `${activeSession.session_id} • Station ${activeSession.station_id}`
                    : 'No Active Session'
                }
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Select Refreshment</label>
              <select
                className="form-control"
                value={selectedItemId}
                onChange={e => setSelectedItemId(e.target.value)}
                disabled={!activeSession}
                required
              >
                <option value="">-- Choose Food or Drink --</option>
                {cafeItems.map(item => (
                  <option key={item.item_id} value={item.item_id}>
                    {item.item_name} - ₹{Number(item.unit_price).toFixed(2)} (Stock: {item.quantity_in_stock})
                  </option>
                ))}
              </select>
            </div>

            {selectedItem && (
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                marginBottom: '1rem',
                fontSize: '0.8125rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Unit Price:</span>
                  <strong style={{ color: 'var(--text-main)' }}>₹{Number(selectedItem.unit_price).toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Available Stock:</span>
                  <span style={{
                    fontWeight: 700,
                    color: selectedItem.quantity_in_stock <= selectedItem.reorder_level ? 'var(--accent-rose)' : 'var(--accent-emerald)'
                  }}>
                    {selectedItem.quantity_in_stock} units
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.35rem', marginTop: '0.35rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Item Subtotal:</span>
                  <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>
                    ₹{(quantity * selectedItem.unit_price).toFixed(2)}
                  </strong>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                min="1"
                max={selectedItem ? selectedItem.quantity_in_stock : 10}
                onChange={e => setQuantity(parseInt(e.target.value, 10) || 1)}
                disabled={!activeSession}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-cyan"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={!activeSession || !selectedItemId || (selectedItem && selectedItem.quantity_in_stock < quantity)}
            >
              <ShoppingBag size={16} />
              Confirm & Order Refreshment
            </button>
          </form>
        </div>

        {/* Current Active Session Orders */}
        <div>
          <div className="table-container">
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Orders for Station {activeSession ? activeSession.station_id : ''}</h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Cost is added to your bill once delivery is confirmed by the café counter
                </div>
              </div>
              <span className="badge badge-cyan">
                {activeSessionOrders.length} items
              </span>
            </div>
            {activeSessionOrders.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No items ordered for this session yet. Pick a snack or drink to be delivered to your station!
              </div>
            ) : (
              <div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Qty</th>
                      <th>Amount</th>
                      <th>Delivery & Bill Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSessionOrders.map(ord => {
                      const isDelivered = ord.order_status === 'Delivered' || ord.order_status === 'Delivered to Station' || ord.delivered;
                      return (
                        <tr key={ord.order_id}>
                          <td>
                            <strong>{ord.item_name}</strong>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{ord.order_id}</div>
                          </td>
                          <td>{ord.quantity}x</td>
                          <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            ₹{Number(ord.amount).toFixed(2)}
                          </td>
                          <td>
                            {isDelivered ? (
                              <span className="badge badge-free" style={{ fontSize: '0.72rem' }}>
                                ✓ Delivered (Added to Bill)
                              </span>
                            ) : (
                              <span className="badge badge-maintenance" style={{ fontSize: '0.72rem' }}>
                                ⏳ In Kitchen / Pending Delivery
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{
                  padding: '1rem 1.25rem',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Delivered & Added to Bill:</span>
                    <strong style={{ color: 'var(--accent-emerald)' }}>
                      ₹{activeSessionOrders
                        .filter(o => o.order_status === 'Delivered' || o.order_status === 'Delivered to Station' || o.delivered)
                        .reduce((sum, o) => sum + Number(o.amount), 0)
                        .toFixed(2)}
                    </strong>
                  </div>
                  {activeSessionOrders.some(o => o.order_status !== 'Delivered' && !o.delivered) && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#D97706', fontWeight: 600 }}>Pending Delivery (Not Billed Yet):</span>
                      <strong style={{ color: '#D97706' }}>
                        ₹{activeSessionOrders
                          .filter(o => o.order_status !== 'Delivered' && !o.delivered)
                          .reduce((sum, o) => sum + Number(o.amount), 0)
                          .toFixed(2)}
                      </strong>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.5rem',
                    marginTop: '0.25rem'
                  }}>
                    <span style={{ fontWeight: 700 }}>Total Café Demands:</span>
                    <span style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '1.05rem' }}>
                      ₹{activeSessionOrders.reduce((sum, o) => sum + Number(o.amount), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
