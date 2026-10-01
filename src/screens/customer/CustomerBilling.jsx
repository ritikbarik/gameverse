import React from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function CustomerBilling({ onOpenReceipt }) {
  const { currentUser, bills } = useApp();

  const myBills = bills.filter(b => b.customer_id === currentUser.user_id);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Receipt size={24} color="var(--accent-cyan)" />
            Billing & Invoices (FR-06)
          </h1>
          <div className="page-subtitle">
            Itemized breakdown of gaming session charges and café refreshments
          </div>
        </div>
      </div>

      <div className="table-container">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.05rem' }}>My Invoices & Payment Status</h2>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Total Invoices: {myBills.length}
          </span>
        </div>

        {myBills.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No bills or receipts found. Completed sessions will generate an invoice here.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Session Ref</th>
                <th>Gaming Charge</th>
                <th>Café Charge</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myBills.map(bill => (
                <tr key={bill.bill_id}>
                  <td className="table-code">{bill.bill_id}</td>
                  <td>{bill.session_id}</td>
                  <td>₹{Number(bill.session_charge).toFixed(2)}</td>
                  <td>₹{Number(bill.cafe_charge).toFixed(2)}</td>
                  <td style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    ₹{Number(bill.total_amount).toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge badge-${bill.payment_status.toLowerCase()}`}>
                      {bill.payment_status}
                    </span>
                  </td>
                  <td>{bill.payment_date || 'Pending'}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenReceipt(bill)}
                    >
                      <FileText size={14} />
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
