import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserPlus, Edit2, Search, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CustomerManagement() {
  const { users, addUser, updateUser } = useApp();

  const customers = users.filter(u => u.role === 'Customer');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('cust123');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone && c.phone.includes(searchTerm)) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setName('');
    setUsername(`cust_${Date.now().toString().slice(-4)}`);
    setPassword('cust123');
    setPhone('');
    setEmail('');
    setShowModal(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setUsername(customer.username);
    setPassword(customer.password);
    setPhone(customer.phone || '');
    setEmail(customer.email || '');
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCustomer) {
      updateUser(editingCustomer.user_id, {
        name,
        username,
        password,
        phone,
        email
      });
    } else {
      addUser({
        name,
        role: 'Customer',
        username,
        password,
        phone,
        email
      });
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={24} color="var(--accent-cyan)" />
            Customer Management
          </h1>
          <div className="page-subtitle">
            Manage customer accounts, contact information, and registration
          </div>
        </div>
        <button className="btn btn-cyan" onClick={handleOpenAdd}>
          <UserPlus size={16} />
          Register New Customer
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="filter-bar">
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: '350px' }}
          placeholder="Search customer by name, ID, phone, email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Total Customers: <strong>{filteredCustomers.length}</strong>
        </div>
      </div>

      {/* Customers Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(cust => (
              <tr key={cust.user_id}>
                <td className="table-code">{cust.user_id}</td>
                <td><strong style={{ color: 'var(--text-main)' }}>{cust.name}</strong></td>
                <td>{cust.username}</td>
                <td>{cust.phone || 'N/A'}</td>
                <td>{cust.email || 'N/A'}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenEdit(cust)}
                  >
                    <Edit2 size={13} />
                    Edit Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCustomer ? 'Edit Customer Details' : 'Register New Customer'}</h3>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Assigned Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="text"
                      className="form-control"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. 555-0199"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. customer@email.com"
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
                  {editingCustomer ? 'Save Changes' : 'Register Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
