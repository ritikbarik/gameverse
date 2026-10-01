import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserPlus, Edit2, Shield, Search } from 'lucide-react';

export default function UserManagement() {
  const { users, addUser, updateUser } = useApp();

  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('Staff');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const displayRole = (r) => {
    if (r === 'Staff' || r === 'Receptionist' || r === 'Café Staff') return 'Café Staff & Receptionist';
    return r;
  };

  const roles = [
    { id: 'Customer', label: 'Customer' },
    { id: 'Staff', label: 'Café Staff & Receptionist' },
    { id: 'Administrator', label: 'Administrator' }
  ];

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'ALL') {
      if (roleFilter === 'Staff') {
        if (u.role !== 'Staff' && u.role !== 'Receptionist' && u.role !== 'Café Staff') return false;
      } else if (u.role !== roleFilter) {
        return false;
      }
    }
    if (searchTerm && !u.name.toLowerCase().includes(searchTerm.toLowerCase()) && !u.username.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setRole('Staff');
    setUsername('');
    setPassword('staff123');
    setPhone('');
    setEmail('');
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setRole(user.role);
    setUsername(user.username);
    setPassword(user.password);
    setPhone(user.phone || '');
    setEmail(user.email || '');
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password) return;

    if (editingUser) {
      updateUser(editingUser.user_id, {
        name,
        role,
        username,
        password,
        phone,
        email
      });
    } else {
      addUser({
        name,
        role,
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
            User & Employee Management (FR-01)
          </h1>
          <div className="page-subtitle">
            Manage system accounts and configure role-based access permissions
          </div>
        </div>
        <button className="btn btn-cyan" onClick={handleOpenAdd}>
          <UserPlus size={16} />
          Create User Account
        </button>
      </div>

      {/* Role Filters */}
      <div className="filter-bar">
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Role Filter:
        </span>
        <button
          className={`filter-chip ${roleFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setRoleFilter('ALL')}
        >
          All Users ({users.length})
        </button>
        {roles.map(r => (
          <button
            key={r.id}
            className={`filter-chip ${roleFilter === r.id ? 'active' : ''}`}
            onClick={() => setRoleFilter(r.id)}
          >
            {r.label} ({
              r.id === 'Staff'
                ? users.filter(u => u.role === 'Staff' || u.role === 'Receptionist' || u.role === 'Café Staff').length
                : users.filter(u => u.role === r.id).length
            })
          </button>
        ))}

        <span style={{ margin: '0 0.5rem', color: 'var(--border-subtle)' }}>|</span>

        <input
          type="text"
          className="form-control"
          style={{ maxWidth: '280px', padding: '0.4rem 0.75rem' }}
          placeholder="Search by name or username..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Assigned Role</th>
              <th>Username</th>
              <th>Password</th>
              <th>Contact Phone</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.user_id}>
                <td className="table-code">{user.user_id}</td>
                <td><strong style={{ color: 'var(--text-main)' }}>{user.name}</strong></td>
                <td>
                  <span className="badge badge-active">
                    <Shield size={10} /> {displayRole(user.role)}
                  </span>
                </td>
                <td>{user.username}</td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ••••••• ({user.password})
                  </span>
                </td>
                <td>{user.phone || 'N/A'}</td>
                <td>{user.email || 'N/A'}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenEdit(user)}
                  >
                    <Edit2 size={13} />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User Credentials' : 'Create New User Account'}</h3>
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
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Assigned Role</label>
                    <select
                      className="form-control"
                      value={role === 'Receptionist' || role === 'Café Staff' ? 'Staff' : role}
                      onChange={e => setRole(e.target.value)}
                    >
                      <option value="Customer">Customer</option>
                      <option value="Staff">Café Staff & Receptionist</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                    />
                  </div>
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

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
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
                  {editingUser ? 'Save Updates' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
