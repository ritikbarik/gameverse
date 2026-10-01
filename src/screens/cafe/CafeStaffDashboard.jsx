import React from 'react';
import { useApp } from '../../context/AppContext';
import { Coffee, Package, AlertTriangle, PlaySquare, ArrowRight } from 'lucide-react';

export default function CafeStaffDashboard({ onNavigate }) {
  const { sessions, orders, inventory } = useApp();

  const activeSessions = sessions.filter(s => s.status === 'Active');
  const lowStockItems = inventory.filter(i => i.quantity_in_stock <= i.reorder_level);
  const totalOrdersAmount = orders.reduce((sum, o) => sum + Number(o.amount), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span style={{ color: 'var(--accent-cyan)' }}>Café Operations</span> — Kitchen & Bar Counter
          </h1>
          <div className="page-subtitle">
            Process station food/beverage orders and manage consumable stock levels
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-cyan" onClick={() => onNavigate('cafe_orders')}>
            <Coffee size={16} />
            Record Station Order
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-cards">
        <div className="card">
          <div className="card-title">
            <span>Active Station Sessions</span>
            <PlaySquare size={18} color="var(--accent-amber)" />
          </div>
          <div className="card-value" style={{ color: 'var(--accent-amber)' }}>
            {activeSessions.length}
          </div>
          <div className="card-hint">Gaming stations ready for orders</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Café Orders Processed</span>
            <Coffee size={18} color="var(--accent-cyan)" />
          </div>
          <div className="card-value">{orders.length}</div>
          <div className="card-hint">Total volume ₹{totalOrdersAmount.toFixed(2)}</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Low-Stock Alerts</span>
            <AlertTriangle size={18} color="var(--accent-rose)" />
          </div>
          <div className="card-value" style={{ color: lowStockItems.length > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            {lowStockItems.length}
          </div>
          <div className="card-hint">Items below required reorder level</div>
        </div>
      </div>

      {/* Low-Stock Warning Banner if any */}
      {lowStockItems.length > 0 && (
        <div
          className="card"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'var(--accent-rose)',
            marginBottom: '1.75rem',
            padding: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle size={24} color="var(--accent-rose)" />
              <div>
                <strong style={{ color: '#fca5a5' }}>
                  {lowStockItems.length} inventory item(s) are below the designated reorder level!
                </strong>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Items: {lowStockItems.map(i => `${i.item_name} (${i.quantity_in_stock} left)`).join(', ')}
                </div>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('cafe_inventory')}>
              Manage Stock
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Two Columns: Active Sessions & Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="table-container">
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem' }}>Active Sessions Ready for Orders</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('cafe_orders')}>
              New Order
            </button>
          </div>
          {activeSessions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No active gaming sessions currently in progress.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Station</th>
                  <th>Customer</th>
                  <th>Started</th>
                </tr>
              </thead>
              <tbody>
                {activeSessions.map(ses => (
                  <tr key={ses.session_id}>
                    <td className="table-code">{ses.session_id}</td>
                    <td><strong style={{ color: 'var(--accent-cyan)' }}>{ses.station_id}</strong></td>
                    <td>{ses.customer_name}</td>
                    <td>{new Date(ses.start_time).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="table-container">
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem' }}>Latest Café Orders</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('cafe_orders')}>
              View Orders
            </button>
          </div>
          {orders.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No orders have been recorded yet.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Session</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(ord => (
                  <tr key={ord.order_id}>
                    <td className="table-code">{ord.order_id}</td>
                    <td>{ord.session_id}</td>
                    <td>{ord.item_name}</td>
                    <td>{ord.quantity}x</td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>₹{Number(ord.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
