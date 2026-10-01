import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, CheckCircle, Clock } from 'lucide-react';

export default function ReceiptModal({ bill, onClose }) {
  const { sessions, orders, stations } = useApp();

  if (!bill) return null;

  const session = sessions.find(s => s.session_id === bill.session_id);
  const sessionOrders = orders.filter(
    o => o.session_id === bill.session_id && (o.order_status === 'Delivered' || o.order_status === 'Delivered to Station' || o.delivered)
  );
  const station = session ? stations.find(st => st.station_id === session.station_id) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Itemized Bill & Receipt</span>
            <span className="table-code">{bill.bill_id}</span>
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.25rem' }}>
          <div className="receipt-paper" id="printable-receipt">
            <div className="receipt-header">
              <div className="receipt-title">GAMEVERSE CAFÉ</div>
              <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '0.2rem' }}>
                GAMING CAFÉ MANAGEMENT SYSTEM
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                Local Station LAN Network • Station {bill.station_id || (session && session.station_id) || 'N/A'}
              </div>
            </div>

            <div className="receipt-row">
              <span>Receipt Ref:</span>
              <span style={{ fontWeight: 700 }}>{bill.bill_id}</span>
            </div>
            <div className="receipt-row">
              <span>Session ID:</span>
              <span>{bill.session_id}</span>
            </div>
            <div className="receipt-row">
              <span>Customer:</span>
              <span style={{ fontWeight: 600 }}>{bill.customer_name || 'Walk-in Customer'}</span>
            </div>
            <div className="receipt-row">
              <span>Station ID:</span>
              <span style={{ fontWeight: 600 }}>{bill.station_id || (session && session.station_id) || 'N/A'} ({station ? station.station_type : 'Station'})</span>
            </div>
            <div className="receipt-row">
              <span>Date:</span>
              <span>{bill.payment_date || new Date().toISOString().split('T')[0]}</span>
            </div>
            <div className="receipt-row">
              <span>Payment Status:</span>
              <span style={{
                fontWeight: 700,
                color: bill.payment_status === 'Paid' ? '#059669' : '#d97706'
              }}>
                {bill.payment_status.toUpperCase()}
              </span>
            </div>

            <div className="receipt-divider" />

            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem', color: '#374151' }}>
              1. Gaming Session Charges
            </div>
            <div className="receipt-row">
              <span>Duration:</span>
              <span>{session ? session.duration : 'Session'}</span>
            </div>
            <div className="receipt-row">
              <span>Hourly Rate:</span>
              <span>₹{station ? Number(station.hourly_rate).toFixed(2) : '80.00'} / hr</span>
            </div>
            <div className="receipt-row" style={{ fontWeight: 600 }}>
              <span>Session Subtotal:</span>
              <span>₹{Number(bill.session_charge).toFixed(2)}</span>
            </div>

            <div className="receipt-divider" />

            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem', color: '#374151' }}>
              2. Café Food & Beverage Charges
            </div>
            {sessionOrders.length === 0 ? (
              <div className="receipt-row" style={{ color: '#6b7280', fontStyle: 'italic' }}>
                <span>No café items ordered</span>
                <span>₹0.00</span>
              </div>
            ) : (
              sessionOrders.map((ord, idx) => (
                <div key={idx} className="receipt-row">
                  <span>{ord.quantity}x {ord.item_name}</span>
                  <span>₹{Number(ord.amount).toFixed(2)}</span>
                </div>
              ))
            )}
            <div className="receipt-row" style={{ fontWeight: 600, marginTop: '0.25rem' }}>
              <span>Café Subtotal:</span>
              <span>₹{Number(bill.cafe_charge).toFixed(2)}</span>
            </div>

            <div className="receipt-total-row">
              <span>TOTAL AMOUNT:</span>
              <span>₹{Number(bill.total_amount).toFixed(2)}</span>
            </div>

            <div className="receipt-footer">
              <div>Thank you for gaming with GameVerse!</div>
              <div>System Timestamp: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-cyan" onClick={handlePrint}>
            <Printer size={16} />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
