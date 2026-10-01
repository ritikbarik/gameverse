import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coffee, Plus, ShoppingBag, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CafeOrders() {
  const { sessions, inventory, orders, addCafeOrder } = useApp();

  const activeSessions = sessions.filter(s => s.status === 'Active');
  const cafeInventory = inventory.filter(i => i.category === 'Café Items');

  const [selectedSessionId, setSelectedSessionId] = useState(activeSessions[0]?.session_id || '');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState(null);

  const selectedItem = cafeInventory.find(i => i.item_id === selectedItemId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedSessionId) {
      setFeedback({ type: 'error', message: 'Please select an active gaming session.' });
      return;
    }
    if (!selectedItemId) {
      setFeedback({ type: 'error', message: 'Please select a café item from inventory.' });
      return;
    }
    if (!quantity || quantity <= 0) {
      setFeedback({ type: 'error', message: 'Quantity must be at least 1.' });
      return;
    }

    const res = addCafeOrder({
      session_id: selectedSessionId,
      item_id: selectedItemId,
      quantity
    });

    if (res.success) {
      setFeedback({
        type: 'success',
        message: `Order recorded! ${quantity}x ${selectedItem.item_name} for Session ${selectedSessionId}. Inventory stock reduced to ${res.order ? selectedItem.quantity_in_stock - quantity : 0}.`
      });
      setQuantity(1);
      setSelectedItemId('');
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Coffee size={24} color="var(--accent-cyan)" />
            Café Order Management (FR-05)
          </h1>
          <div className="page-subtitle">
            Record food and beverage orders against active gaming sessions and automatically decrement inventory
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
        {/* Order Form */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
            Record New Café Order (FR-05)
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

          {activeSessions.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)' }}>
              No active sessions currently available. A customer must be in an active session to place orders.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Select Active Session</label>
                <select
                  className="form-control"
                  value={selectedSessionId}
                  onChange={e => setSelectedSessionId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Active Session --</option>
                  {activeSessions.map(ses => (
                    <option key={ses.session_id} value={ses.session_id}>
                      {ses.session_id} - Station {ses.station_id} ({ses.customer_name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Inventory Item</label>
                <select
                  className="form-control"
                  value={selectedItemId}
                  onChange={e => setSelectedItemId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Item --</option>
                  {cafeInventory.map(item => (
                    <option key={item.item_id} value={item.item_id}>
                      {item.item_name} - ₹{Number(item.unit_price).toFixed(2)} [Stock: {item.quantity_in_stock}]
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
                  marginBottom: '1.1rem',
                  fontSize: '0.8125rem'
                }}>
                  <div className="receipt-row">
                    <span>Item ID:</span>
                    <strong className="table-code">{selectedItem.item_id}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Unit Price:</span>
                    <span>₹{Number(selectedItem.unit_price).toFixed(2)}</span>
                  </div>
                  <div className="receipt-row">
                    <span>Current Stock:</span>
                    <strong style={{ color: selectedItem.quantity_in_stock <= selectedItem.reorder_level ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                      {selectedItem.quantity_in_stock} in stock
                    </strong>
                  </div>
                  <div className="receipt-row" style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.35rem', marginTop: '0.35rem' }}>
                    <span>Calculated Order Amount:</span>
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
                  max={selectedItem ? selectedItem.quantity_in_stock : 20}
                  onChange={e => setQuantity(parseInt(e.target.value, 10) || 1)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-cyan"
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={!selectedItemId || (selectedItem && selectedItem.quantity_in_stock < quantity)}
              >
                <ShoppingBag size={16} />
                Record Order & Decrement Stock
              </button>
            </form>
          )}
        </div>

        {/* All Orders Log */}
        <div className="table-container">
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.05rem' }}>Orders Log</h2>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Total Orders: {orders.length}
            </span>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Session</th>
                <th>Item Name</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(ord => (
                <tr key={ord.order_id}>
                  <td className="table-code">{ord.order_id}</td>
                  <td><strong>{ord.session_id}</strong></td>
                  <td>{ord.item_name}</td>
                  <td>{ord.quantity}x</td>
                  <td>₹{Number(ord.unit_price).toFixed(2)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    ₹{Number(ord.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
