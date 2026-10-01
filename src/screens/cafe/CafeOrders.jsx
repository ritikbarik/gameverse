import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Coffee,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Clock,
  Truck,
  Check,
  DollarSign,
  AlertTriangle,
  Monitor
} from 'lucide-react';

export default function CafeOrders() {
  const { sessions, inventory, orders, addCafeOrder, confirmOrderDelivery } = useApp();

  const activeSessions = sessions.filter(s => s.status === 'Active');
  const cafeInventory = inventory.filter(i => i.category === 'Café Items');

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'new_order'
  const [filterStatus, setFilterStatus] = useState('PENDING'); // 'ALL' | 'PENDING' | 'DELIVERED'

  const [selectedSessionId, setSelectedSessionId] = useState(activeSessions[0]?.session_id || '');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliverImmediately, setDeliverImmediately] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const selectedItem = cafeInventory.find(i => i.item_id === selectedItemId);

  // Categorize orders
  const pendingOrders = orders.filter(
    o => o.order_status !== 'Delivered' && o.order_status !== 'Delivered to Station' && !o.delivered
  );
  const deliveredOrders = orders.filter(
    o => o.order_status === 'Delivered' || o.order_status === 'Delivered to Station' || o.delivered
  );
  const deliveredRevenue = deliveredOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);

  const filteredOrders = orders.filter(ord => {
    const isDelivered = ord.order_status === 'Delivered' || ord.order_status === 'Delivered to Station' || ord.delivered;
    if (filterStatus === 'PENDING') return !isDelivered;
    if (filterStatus === 'DELIVERED') return isDelivered;
    return true;
  });

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
      quantity,
      delivered: deliverImmediately
    });

    if (res.success) {
      setFeedback({
        type: 'success',
        message: deliverImmediately
          ? `Order recorded & confirmed delivered! ₹${res.order.amount.toFixed(2)} added directly to the session bill.`
          : `Order placed in kitchen queue for Station ${res.order.station_id}. Confirm delivery once dispatched to add to bill.`
      });
      setQuantity(1);
      setSelectedItemId('');
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleConfirmDelivery = (orderId) => {
    confirmOrderDelivery(orderId);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">CAFÉ PORTAL & KITCHEN</span>
          </div>
          <h1 className="page-title">
            <Coffee size={24} color="var(--accent-cyan)" />
            Café Order Management & Station Delivery
          </h1>
          <div className="page-subtitle">
            Receive customer refreshment orders, dispatch to gaming stations, and confirm deliveries to add costs to the reception bill
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className={`btn ${activeTab === 'queue' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('queue')}
          >
            <Truck size={16} />
            Kitchen & Delivery Queue ({pendingOrders.length})
          </button>
          <button
            className={`btn ${activeTab === 'new_order' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('new_order')}
          >
            <ShoppingBag size={16} />
            Take Counter Order
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-cards" style={{ marginBottom: '1.75rem' }}>
        <div className="card">
          <div className="card-title">
            <span>Pending Station Deliveries</span>
            <Clock size={18} color="var(--accent-amber)" />
          </div>
          <div className="card-value" style={{ color: pendingOrders.length > 0 ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
            {pendingOrders.length}
          </div>
          <div className="card-hint">Ordered by customers • Waiting for dispatch</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Delivered & Billed Orders</span>
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
          </div>
          <div className="card-value" style={{ color: 'var(--accent-emerald)' }}>
            {deliveredOrders.length}
          </div>
          <div className="card-hint">Confirmed delivered • Added to session bill</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Delivered Café Revenue</span>
            <DollarSign size={18} color="var(--accent-cyan)" />
          </div>
          <div className="card-value" style={{ color: 'var(--accent-cyan)' }}>
            ₹{deliveredRevenue.toFixed(2)}
          </div>
          <div className="card-hint">Added to final reception settlement</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Active Station Sessions</span>
            <Monitor size={18} color="var(--accent-rose)" />
          </div>
          <div className="card-value">{activeSessions.length}</div>
          <div className="card-hint">Stations eligible for food orders</div>
        </div>
      </div>

      {/* TAB 1: KITCHEN & DISPATCH QUEUE */}
      {activeTab === 'queue' && (
        <div>
          {/* Filter Bar */}
          <div className="filter-bar" style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Queue View:
            </span>
            <button
              className={`filter-chip ${filterStatus === 'PENDING' ? 'active' : ''}`}
              onClick={() => setFilterStatus('PENDING')}
            >
              ⏳ Pending Delivery ({pendingOrders.length})
            </button>
            <button
              className={`filter-chip ${filterStatus === 'DELIVERED' ? 'active' : ''}`}
              onClick={() => setFilterStatus('DELIVERED')}
            >
              ✓ Delivered & Billed ({deliveredOrders.length})
            </button>
            <button
              className={`filter-chip ${filterStatus === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ALL')}
            >
              All Orders ({orders.length})
            </button>
          </div>

          <div className="table-container">
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  {filterStatus === 'PENDING' ? 'Station Delivery Queue (Awaiting Delivery Confirmation)' : 'Café Orders Record'}
                </h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Once marked "Delivered", the order cost automatically adds to the customer's bill for reception payment.
                </div>
              </div>
              <span className="badge badge-primary">
                {filteredOrders.length} records
              </span>
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                {filterStatus === 'PENDING' ? (
                  <div>
                    <CheckCircle2 size={36} color="var(--accent-emerald)" style={{ margin: '0 auto 0.75rem' }} />
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1rem' }}>
                      All Orders Delivered!
                    </div>
                    <div style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                      No station deliveries are currently waiting in the kitchen queue.
                    </div>
                  </div>
                ) : (
                  'No orders found matching this filter.'
                )}
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Station ID</th>
                    <th>Customer Name</th>
                    <th>Items Ordered</th>
                    <th>Total Amount</th>
                    <th>Order Time</th>
                    <th>Delivery & Billing Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(ord => {
                    const isDelivered = ord.order_status === 'Delivered' || ord.order_status === 'Delivered to Station' || ord.delivered;
                    return (
                      <tr key={ord.order_id} style={{ background: !isDelivered ? 'rgba(245, 158, 11, 0.04)' : undefined }}>
                        <td className="table-code">{ord.order_id}</td>
                        <td>
                          <span style={{
                            fontWeight: 800,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            background: !isDelivered ? '#FEF3C7' : '#E0F2FE',
                            color: !isDelivered ? '#92400E' : '#0369A1',
                            border: `1px solid ${!isDelivered ? '#FCD34D' : '#BAE6FD'}`
                          }}>
                            {ord.station_id || 'Station'}
                          </span>
                        </td>
                        <td>
                          <strong>{ord.customer_name || 'Customer'}</strong>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {ord.session_id}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            {ord.quantity}x
                          </span>{' '}
                          {ord.item_name}
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            ₹{Number(ord.unit_price).toFixed(2)} each
                          </div>
                        </td>
                        <td style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>
                          ₹{Number(ord.amount).toFixed(2)}
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8rem' }}>
                            {new Date(ord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {new Date(ord.timestamp).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          {isDelivered ? (
                            <div>
                              <span className="badge badge-free" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Check size={12} />
                                Delivered & Added to Bill
                              </span>
                              {ord.delivered_at && (
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                  Delivered: {new Date(ord.delivered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="badge badge-maintenance" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Clock size={12} />
                              Pending Delivery (Not Billed Yet)
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {!isDelivered ? (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleConfirmDelivery(ord.order_id)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                            >
                              <Truck size={14} />
                              Confirm Delivery
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                              ✓ Billed to Session
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TAKE COUNTER ORDER */}
      {activeTab === 'new_order' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
          {/* Order Form */}
          <div className="card">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
              Take Walk-in / Counter Café Order
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
                No active gaming sessions currently in progress. A customer must be seated in an active session to link café orders.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Select Active Session & Station</label>
                  <select
                    className="form-control"
                    value={selectedSessionId}
                    onChange={e => setSelectedSessionId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Active Station --</option>
                    {activeSessions.map(ses => (
                      <option key={ses.session_id} value={ses.session_id}>
                        Station {ses.station_id} — {ses.customer_name} ({ses.session_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Refreshment / Food Item</label>
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

                <div className="form-group" style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={deliverImmediately}
                      onChange={e => setDeliverImmediately(e.target.checked)}
                      style={{ accentColor: '#C62828', width: '16px', height: '16px' }}
                    />
                    <div>
                      <strong>Delivered immediately at counter</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        If checked, confirms delivery now and adds ₹{selectedItem ? (quantity * selectedItem.unit_price).toFixed(2) : '0.00'} directly to the session bill.
                      </div>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  disabled={!selectedItemId || (selectedItem && selectedItem.quantity_in_stock < quantity)}
                >
                  <ShoppingBag size={16} />
                  Record Order & Decrement Stock
                </button>
              </form>
            )}
          </div>

          {/* Quick Active Stations Panel */}
          <div className="card">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
              Active Sessions for Ordering
            </h2>
            {activeSessions.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No active players in the cafe right now.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeSessions.map(ses => {
                  const sessionDeliveredOrders = orders.filter(
                    o => o.session_id === ses.session_id && (o.order_status === 'Delivered' || o.delivered)
                  );
                  const sessionPendingOrders = orders.filter(
                    o => o.session_id === ses.session_id && o.order_status !== 'Delivered' && !o.delivered
                  );
                  const totalDelivered = sessionDeliveredOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);

                  return (
                    <div
                      key={ses.session_id}
                      onClick={() => setSelectedSessionId(ses.session_id)}
                      style={{
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: selectedSessionId === ses.session_id ? 'rgba(198, 40, 40, 0.06)' : 'var(--bg-surface)',
                        border: `1px solid ${selectedSessionId === ses.session_id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>Station {ses.station_id}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                            ({ses.customer_name})
                          </span>
                        </div>
                        <span className="badge badge-occupied">ACTIVE</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Delivered to Bill: ₹{totalDelivered.toFixed(2)} ({sessionDeliveredOrders.length} items)</span>
                        {sessionPendingOrders.length > 0 && (
                          <span style={{ color: '#D97706', fontWeight: 700 }}>
                            {sessionPendingOrders.length} pending delivery
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
