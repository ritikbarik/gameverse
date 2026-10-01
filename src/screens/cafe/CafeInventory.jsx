import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, AlertTriangle, CheckCircle2, Edit2, Search, ArrowUpCircle } from 'lucide-react';

export default function CafeInventory() {
  const { inventory, updateStock } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [newStockQty, setNewStockQty] = useState('');

  const filteredItems = inventory.filter(item => {
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (searchTerm && !item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) && !item.item_id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const lowStockCount = inventory.filter(i => i.quantity_in_stock <= i.reorder_level).length;

  const handleUpdateStock = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    updateStock(editingItem.item_id, parseInt(newStockQty, 10));
    setEditingItem(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Package size={24} color="var(--accent-cyan)" />
            Inventory & Stock Control (FR-07)
          </h1>
          <div className="page-subtitle">
            Monitor stock levels, identify items below reorder threshold, and update quantities
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-cards">
        <div className="card">
          <div className="card-title">
            <span>Total Inventory Items</span>
            <Package size={18} color="var(--accent-cyan)" />
          </div>
          <div className="card-value">{inventory.length}</div>
          <div className="card-hint">Consumables and accessories</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Below Reorder Level</span>
            <AlertTriangle size={18} color="var(--accent-rose)" />
          </div>
          <div className="card-value" style={{ color: lowStockCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            {lowStockCount}
          </div>
          <div className="card-hint">Requires stock replenishment</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Stock Status</span>
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
          </div>
          <div className="card-value" style={{ color: 'var(--accent-emerald)', fontSize: '1.25rem' }}>
            {lowStockCount === 0 ? 'Optimal' : 'Attention Needed'}
          </div>
          <div className="card-hint">Auto-synced with café orders</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Category:
        </span>
        <button
          className={`filter-chip ${categoryFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('ALL')}
        >
          All Categories
        </button>
        <button
          className={`filter-chip ${categoryFilter === 'Café Items' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('Café Items')}
        >
          Café Items
        </button>
        <button
          className={`filter-chip ${categoryFilter === 'Gaming Accessories' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('Gaming Accessories')}
        >
          Gaming Accessories
        </button>

        <span style={{ margin: '0 0.5rem', color: 'var(--border-subtle)' }}>|</span>

        <input
          type="text"
          className="form-control"
          style={{ maxWidth: '280px', padding: '0.4rem 0.75rem' }}
          placeholder="Search items by name or ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Inventory Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>In Stock</th>
              <th>Reorder Level</th>
              <th>Unit Price</th>
              <th>Stock Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => {
              const isLow = item.quantity_in_stock <= item.reorder_level;
              return (
                <tr key={item.item_id}>
                  <td className="table-code">{item.item_id}</td>
                  <td><strong style={{ color: 'var(--text-main)' }}>{item.item_name}</strong></td>
                  <td>{item.category}</td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: isLow ? 'var(--accent-rose)' : 'var(--text-main)'
                    }}>
                      {item.quantity_in_stock}
                    </span>
                  </td>
                  <td>{item.reorder_level}</td>
                  <td>₹{Number(item.unit_price).toFixed(2)}</td>
                  <td>
                    {isLow ? (
                      <span className="badge badge-lowstock">
                        <AlertTriangle size={11} /> LOW STOCK
                      </span>
                    ) : (
                      <span className="badge badge-free">
                        <CheckCircle2 size={11} /> IN STOCK
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setEditingItem(item);
                        setNewStockQty(item.quantity_in_stock.toString());
                      }}
                    >
                      <Edit2 size={13} />
                      Update Stock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Update Stock Modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Stock Quantity</h3>
            </div>
            <form onSubmit={handleUpdateStock}>
              <div className="modal-body">
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div className="receipt-row">
                    <span>Item:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{editingItem.item_name}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Category:</span>
                    <span>{editingItem.category}</span>
                  </div>
                  <div className="receipt-row">
                    <span>Reorder Level:</span>
                    <span>{editingItem.reorder_level} units</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">New Quantity In Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={newStockQty}
                    onChange={e => setNewStockQty(e.target.value)}
                    required
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    Enter current verified physical count in café storage.
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-cyan">
                  Save Stock Quantity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
