import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Plus, Edit2, AlertTriangle, CheckCircle2, Search } from 'lucide-react';

export default function AdminInventory() {
  const { inventory, addInventoryItem, updateInventoryItem } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Café Items');
  const [stockQty, setStockQty] = useState('10');
  const [reorderLevel, setReorderLevel] = useState('5');
  const [unitPrice, setUnitPrice] = useState('3.50');

  const filteredItems = inventory.filter(item => {
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (searchTerm && !item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) && !item.item_id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const lowStockCount = inventory.filter(i => i.quantity_in_stock <= i.reorder_level).length;

  const handleOpenAdd = () => {
    setEditingItem(null);
    setItemId(`INV-${String(inventory.length + 1).padStart(2, '0')}`);
    setItemName('');
    setCategory('Café Items');
    setStockQty('15');
    setReorderLevel('5');
    setUnitPrice('4.00');
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setItemId(item.item_id);
    setItemName(item.item_name);
    setCategory(item.category);
    setStockQty(item.quantity_in_stock.toString());
    setReorderLevel(item.reorder_level.toString());
    setUnitPrice(item.unit_price.toString());
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!itemId.trim() || !itemName.trim()) return;

    if (editingItem) {
      updateInventoryItem(editingItem.item_id, {
        item_name: itemName,
        category,
        quantity_in_stock: parseInt(stockQty, 10) || 0,
        reorder_level: parseInt(reorderLevel, 10) || 0,
        unit_price: parseFloat(unitPrice) || 1.00
      });
    } else {
      addInventoryItem({
        item_id: itemId,
        item_name: itemName,
        category,
        quantity_in_stock: stockQty,
        reorder_level: reorderLevel,
        unit_price: unitPrice
      });
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Package size={24} color="var(--accent-cyan)" />
            Inventory Administration (FR-07)
          </h1>
          <div className="page-subtitle">
            Configure stock items, reorder thresholds, and pricing for café refreshments and gaming accessories
          </div>
        </div>
        <button className="btn btn-cyan" onClick={handleOpenAdd}>
          <Plus size={16} />
          Add Inventory Item
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid-cards">
        <div className="card">
          <div className="card-title">
            <span>Total Catalog Items</span>
            <Package size={18} color="var(--accent-cyan)" />
          </div>
          <div className="card-value">{inventory.length}</div>
          <div className="card-hint">Managed inventory catalog</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Items Below Reorder Level</span>
            <AlertTriangle size={18} color="var(--accent-rose)" />
          </div>
          <div className="card-value" style={{ color: lowStockCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            {lowStockCount}
          </div>
          <div className="card-hint">Trigger replenishment orders</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Total Inventory Value</span>
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
          </div>
          <div className="card-value" style={{ color: 'var(--accent-emerald)' }}>
            ₹{inventory.reduce((sum, i) => sum + (i.quantity_in_stock * i.unit_price), 0).toFixed(2)}
          </div>
          <div className="card-hint">Total asset valuation</div>
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
          All
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
          placeholder="Search items..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity in Stock</th>
              <th>Reorder Level</th>
              <th>Unit Price</th>
              <th>Status</th>
              <th>Actions</th>
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
                    <span style={{ fontWeight: 700, color: isLow ? 'var(--accent-rose)' : 'var(--text-main)' }}>
                      {item.quantity_in_stock}
                    </span>
                  </td>
                  <td>{item.reorder_level}</td>
                  <td>₹{Number(item.unit_price).toFixed(2)}</td>
                  <td>
                    {isLow ? (
                      <span className="badge badge-lowstock">
                        <AlertTriangle size={11} /> BELOW REORDER
                      </span>
                    ) : (
                      <span className="badge badge-free">
                        <CheckCircle2 size={11} /> SUFFICIENT
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <Edit2 size={13} />
                      Modify Item
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Modify Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? `Modify ${editingItem.item_name}` : 'Add New Inventory Item'}</h3>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Item ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={itemId}
                    onChange={e => setItemId(e.target.value)}
                    disabled={!!editingItem}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Item Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={itemName}
                    onChange={e => setItemName(e.target.value)}
                    placeholder="e.g. Energy Drink 500ml or Mechanical Keycaps"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category (SRS)</label>
                    <select
                      className="form-control"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      <option value="Café Items">Café Items</option>
                      <option value="Gaming Accessories">Gaming Accessories</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit Price (₹)</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      className="form-control"
                      value={unitPrice}
                      onChange={e => setUnitPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Quantity in Stock</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={stockQty}
                      onChange={e => setStockQty(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Reorder Level Threshold</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={reorderLevel}
                      onChange={e => setReorderLevel(e.target.value)}
                      required
                    />
                  </div>
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
                  {editingItem ? 'Save Item Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
