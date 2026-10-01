import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, DollarSign, FileText, CheckCircle2, Clock, Filter } from 'lucide-react';

export default function ReceptionistBilling({ onOpenReceipt }) {
  const { bills, recordPayment } = useApp();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [payingBill, setPayingBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const filteredBills = bills.filter(b => {
    if (filterStatus === 'ALL') return true;
    return b.payment_status === filterStatus;
  });

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!payingBill) return;

    const updated = recordPayment(payingBill.bill_id, paymentMethod);
    setPayingBill(null);
    if (updated && onOpenReceipt) {
      onOpenReceipt(updated);
    }
  };

  const totalCollected = bills
    .filter(b => b.payment_status === 'Paid')
    .reduce((sum, b) => sum + Number(b.total_amount), 0);

  const totalOutstanding = bills
    .filter(b => b.payment_status === 'Unpaid')
    .reduce((sum, b) => sum + Number(b.total_amount), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Receipt size={24} color="var(--accent-emerald)" />
            Billing & Payment Desk (FR-06)
          </h1>
          <div className="page-subtitle">
            Process invoices combining gaming charges + café charges, record counter payments, and generate official receipts
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-cards">
        <div className="card">
          <div className="card-title">
            <span>Total Bills Issued</span>
            <Receipt size={18} color="var(--accent-cyan)" />
          </div>
          <div className="card-value">{bills.length}</div>
          <div className="card-hint">System itemized bills</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Paid Revenue Collected</span>
            <DollarSign size={18} color="var(--accent-emerald)" />
          </div>
          <div className="card-value" style={{ color: 'var(--accent-emerald)' }}>
            ₹{totalCollected.toFixed(2)}
          </div>
          <div className="card-hint">Settled cash/card transactions</div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Pending Unpaid Balance</span>
            <Clock size={18} color="var(--accent-amber)" />
          </div>
          <div className="card-value" style={{ color: 'var(--accent-amber)' }}>
            ₹{totalOutstanding.toFixed(2)}
          </div>
          <div className="card-hint">Awaiting payment settlement</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filter-bar">
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Payment Status Filter:
        </span>
        <button
          className={`filter-chip ${filterStatus === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilterStatus('ALL')}
        >
          All Invoices ({bills.length})
        </button>
        <button
          className={`filter-chip ${filterStatus === 'Unpaid' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Unpaid')}
        >
          Unpaid ({bills.filter(b => b.payment_status === 'Unpaid').length})
        </button>
        <button
          className={`filter-chip ${filterStatus === 'Paid' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Paid')}
        >
          Paid ({bills.filter(b => b.payment_status === 'Paid').length})
        </button>
      </div>

      {/* Invoices Table */}
      <div className="table-container">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.05rem' }}>Itemized Bills Register</h2>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Session ID</th>
              <th>Customer</th>
              <th>Station</th>
              <th>Gaming Charge</th>
              <th>Café Charge</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map(bill => (
              <tr key={bill.bill_id}>
                <td className="table-code">{bill.bill_id}</td>
                <td>{bill.session_id}</td>
                <td><strong style={{ color: 'var(--text-main)' }}>{bill.customer_name}</strong></td>
                <td><strong>{bill.station_id || 'N/A'}</strong></td>
                <td>₹{Number(bill.session_charge).toFixed(2)}</td>
                <td>₹{Number(bill.cafe_charge).toFixed(2)}</td>
                <td style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-cyan)' }}>
                  ₹{Number(bill.total_amount).toFixed(2)}
                </td>
                <td>
                  <span className={`badge badge-${bill.payment_status.toLowerCase()}`}>
                    {bill.payment_status}
                  </span>
                </td>
                <td>{bill.payment_date || 'Pending'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {bill.payment_status === 'Unpaid' && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          setPayingBill(bill);
                          setPaymentMethod('Cash');
                        }}
                      >
                        <DollarSign size={13} />
                        Record Payment
                      </button>
                    )}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenReceipt(bill)}
                    >
                      <FileText size={13} />
                      Receipt
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      {payingBill && (
        <div className="modal-overlay" onClick={() => setPayingBill(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Record Counter Payment (FR-06)</h3>
            </div>
            <form onSubmit={handleRecordPayment}>
              <div className="modal-body">
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div className="receipt-row">
                    <span>Invoice Ref:</span>
                    <strong className="table-code">{payingBill.bill_id}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Customer:</span>
                    <strong>{payingBill.customer_name}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Gaming Session Charge:</span>
                    <span>₹{Number(payingBill.session_charge).toFixed(2)}</span>
                  </div>
                  <div className="receipt-row">
                    <span>Café Orders Charge:</span>
                    <span>₹{Number(payingBill.cafe_charge).toFixed(2)}</span>
                  </div>
                  <div className="receipt-divider" />
                  <div className="receipt-row" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                    <span>Total Amount Due:</span>
                    <span style={{ color: 'var(--accent-emerald)' }}>
                      ₹{Number(payingBill.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tender / Payment Method</label>
                  <select
                    className="form-control"
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                  >
                    <option value="Cash">Cash (Counter Tender)</option>
                    <option value="Credit / Debit Card">Credit / Debit Card (LAN Terminal)</option>
                    <option value="UPI / QR (In-Store Scan)">UPI / QR (In-Store Scan)</option>
                  </select>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Payment recorded locally per SRS specifications.
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPayingBill(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  <CheckCircle2 size={16} />
                  Confirm & Mark as Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
