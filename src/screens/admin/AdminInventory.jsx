import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Plus,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  Search,
  Coffee,
  Gamepad2,
  Trash2,
  Sparkles
} from 'lucide-react';

export default function AdminInventory() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Café Items');
  const [stockQty, setStockQty] = useState('15');
  const [reorderLevel, setReorderLevel] = useState('5');
  const [unitPrice, setUnitPrice] = useState('80.00');

  const filteredItems = inventory.filter(item => {
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (searchTerm && !item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) && !item.item_id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const lowStockCount = inventory.filter(i => i.quantity_in_stock <= i.reorder_level).length;
  const cafeCount = inventory.filter(i => i.category === 'Café Items').length;
  const accessoriesCount = inventory.filter(i => i.category === 'Gaming Accessories').length;

  const CAFE_PRESETS = [
    { name: 'Caramel Cold Brew Coffee 350ml', price: '90.00', stock: '25', reorder: '8' },
    { name: 'Monster Energy Drink 500ml', price: '120.00', stock: '20', reorder: '5' },
    { name: 'Red Bull Energy 250ml', price: '125.00', stock: '24', reorder: '6' },
    { name: 'Loaded Cheesy Nachos', price: '150.00', stock: '15', reorder: '4' },
    { name: 'Crispy Chicken Crunch Burger', price: '180.00', stock: '12', reorder: '4' },
    { name: 'Peri Peri French Fries', price: '99.00', stock: '20', reorder: '5' },
    { name: 'Artisan Choco Lava Cake', price: '110.00', stock: '14', reorder: '4' },
  ];

  const ACCESSORY_PRESETS = [
    { name: 'PS5 DualSense Wireless Controller', price: '5499.00', stock: '6', reorder: '2' },
    { name: 'Xbox Series X/S Wireless Controller', price: '5199.00', stock: '6', reorder: '2' },
    { name: 'RGB Mechanical Gaming Keyboard (Blue Switch)', price: '2999.00', stock: '8', reorder: '3' },
    { name: '7.1 Surround Gaming Headset with Mic', price: '2499.00', stock: '10', reorder: '3' },
    { name: 'Precision Speed Mousepad XL (900x400mm)', price: '499.00', stock: '20', reorder: '5' },
    { name: 'Silicone Analog Thumb Grips Set (4-pack)', price: '199.00', stock: '35', reorder: '8' },
    { name: 'Braided Fast-Charging Type-C Cable 2M', price: '299.00', stock: '25', reorder: '6' },
    { name: 'VR Headset Breathable Eye Foam Cushion', price: '399.00', stock: '12', reorder: '4' },
  ];

  const handleOpenAddWithCategory = (cat) => {
    setEditingItem(null);
    const prefix = cat === 'Gaming Accessories' ? 'ACC' : 'CAF';
    const existingCount = inventory.filter(i => i.category === cat).length;
    setItemId(`${prefix}-${String(existingCount + 1).padStart(2, '0')}`);
    setItemName('');
    setCategory(cat);
    if (cat === 'Gaming Accessories') {
      setStockQty('10');
      setReorderLevel('3');
      setUnitPrice('499.00');
    } else {
      setStockQty('20');
      setReorderLevel('5');
      setUnitPrice('90.00');
    }
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

  const applyPreset = (preset) => {
    setItemName(preset.name);
    setUnitPrice(preset.price);
    setStockQty(preset.stock);
    setReorderLevel(preset.reorder);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete item ${id}? This cannot be undone.`)) {
      if (deleteInventoryItem) {
        deleteInventoryItem(id);
      }
      setShowModal(false);
    }
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
      <div className="page-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">
            <Package size={24} color="var(--accent-blue)" />
            Inventory & Catalog Administration (FR-07)
          </h1>
          <div className="page-subtitle">
            Configure stock items, reorder thresholds, and pricing for café refreshments and gaming accessories
          </div>
        </div>

        {/* Dual Quick-Add Buttons for Café and Gaming Accessories */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => handleOpenAddWithCategory('Café Items')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
          >
            <Coffee size={16} />
            <span>+ Add Café Item</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => handleOpenAddWithCategory('Gaming Accessories')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 700,
              borderColor: 'var(--blue-border)',
              color: 'var(--blue-primary)',
              background: 'var(--blue-light)'
            }}
          >
            <Gamepad2 size={16} />
            <span>+ Add Gaming Accessory</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid-cards">
        <div className="card">
          <div className="card-title">
            <span>Total Catalog Items</span>
            <Package size={18} color="var(--accent-blue)" />
          </div>
          <div className="card-value">{inventory.length}</div>
          <div className="card-hint">Managed inventory catalog</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Café Refreshments</span>
            <Coffee size={18} color="var(--accent-blue)" />
          </div>
          <div className="card-value">{cafeCount}</div>
          <div className="card-hint">Beverages, meals & snacks</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Gaming Accessories</span>
            <Gamepad2 size={18} color="var(--accent-blue)" />
          </div>
          <div className="card-value">{accessoriesCount}</div>
          <div className="card-hint">Controllers, headsets & gear</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Low Stock Warnings</span>
            <AlertTriangle size={18} color={lowStockCount > 0 ? '#E65100' : 'var(--accent-emerald)'} />
          </div>
          <div className="card-value" style={{ color: lowStockCount > 0 ? '#E65100' : 'var(--accent-emerald)' }}>
            {lowStockCount}
          </div>
          <div className="card-hint">Items at or below reorder limit</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Total Inventory Value</span>
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
          All Items ({inventory.length})
        </button>
        <button
          className={`filter-chip ${categoryFilter === 'Café Items' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('Café Items')}
        >
          Café Items ({cafeCount})
        </button>
        <button
          className={`filter-chip ${categoryFilter === 'Gaming Accessories' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('Gaming Accessories')}
        >
          Gaming Accessories ({accessoriesCount})
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
              <th>Catalog Item Name</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>In Stock</th>
              <th>Reorder Limit</th>
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
                  <td>
                    <strong style={{ color: 'var(--text-main)' }}>{item.item_name}</strong>
                  </td>
                  <td>
                    <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      {item.category === 'Gaming Accessories' ? <Gamepad2 size={12} /> : <Coffee size={12} />}
                      {item.category}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    ₹{Number(item.unit_price).toFixed(2)}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: isLow ? '#C62828' : 'var(--text-main)' }}>
                    {item.quantity_in_stock}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {item.reorder_level}
                  </td>
                  <td>
                    {isLow ? (
                      <span className="badge badge-cancelled">
                        <AlertTriangle size={11} /> REORDER REQUIRED
                      </span>
                    ) : (
                      <span className="badge badge-free">
                        <CheckCircle2 size={11} /> SUFFICIENT
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEdit(item)}
                      >
                        <Edit2 size={13} />
                        Edit
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDelete(item.item_id)}
                        style={{ color: '#DC2626' }}
                        title="Delete item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
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
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3>{editingItem ? `Modify ${editingItem.item_name}` : `Add New ${category === 'Gaming Accessories' ? 'Gaming Accessory' : 'Café Item'}`}</h3>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {/* Quick Presets helper when creating new items */}
                {!editingItem && (
                  <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--bg-card-hover)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--blue-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      <Sparkles size={13} />
                      <span>Quick Presets for {category}:</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {(category === 'Gaming Accessories' ? ACCESSORY_PRESETS : CAFE_PRESETS).map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => applyPreset(p)}
                          style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            padding: '0.25rem 0.55rem',
                            fontSize: '0.725rem',
                            fontWeight: 600,
                            color: 'var(--text-main)',
                            cursor: 'pointer'
                          }}
                        >
                          + {p.name.split('(')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
                    placeholder="e.g. PS5 DualSense Controller or Energy Drink 500ml"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-control"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      <option value="Café Items">Café Items (Food & Beverages)</option>
                      <option value="Gaming Accessories">Gaming Accessories (Gear & Peripherals)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit Price (₹)</label>
                    <input
                      type="number"
                      step="0.50"
                      min="0.50"
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

              <div className="modal-footer" style={{ justifyContent: editingItem ? 'space-between' : 'flex-end' }}>
                {editingItem && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleDelete(editingItem.item_id)}
                    style={{ color: '#ff4d4f', borderColor: 'rgba(229, 9, 20, 0.35)', background: 'rgba(229, 9, 20, 0.12)' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                )}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingItem ? 'Save Item Changes' : 'Create Item'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
