import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileBarChart, Calendar, Printer, DollarSign, Monitor, Package, CheckCircle2 } from 'lucide-react';

export default function AdminReports() {
  const { bills, sessions, stations, inventory, orders } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [reportType, setReportType] = useState('REVENUE'); // 'REVENUE' | 'USAGE' | 'INVENTORY'
  const [startDate, setStartDate] = useState(lastMonth);
  const [endDate, setEndDate] = useState(today);
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();

    if (reportType === 'REVENUE') {
      // Filter bills by date range (using payment_date or fallback to today)
      const filteredBills = bills.filter(b => {
        const bDate = b.payment_date || today;
        return bDate >= startDate && bDate <= endDate;
      });

      const totalGaming = filteredBills.reduce((sum, b) => sum + Number(b.session_charge), 0);
      const totalCafe = filteredBills.reduce((sum, b) => sum + Number(b.cafe_charge), 0);
      const totalRevenue = totalGaming + totalCafe;

      setGeneratedReport({
        type: 'REVENUE',
        title: 'Official Revenue Report',
        startDate,
        endDate,
        records: filteredBills,
        summary: {
          totalGaming,
          totalCafe,
          totalRevenue,
          billCount: filteredBills.length,
          paidCount: filteredBills.filter(b => b.payment_status === 'Paid').length
        }
      });
    } else if (reportType === 'USAGE') {
      // Aggregate usage per station within date range
      const filteredSessions = sessions.filter(s => {
        const sDate = s.start_time.split('T')[0];
        return sDate >= startDate && sDate <= endDate;
      });

      const stationStats = stations.map(st => {
        const stSessions = filteredSessions.filter(s => s.station_id === st.station_id);
        const sessionCount = stSessions.length;
        const totalHours = stSessions.reduce((sum, s) => sum + (Number(s.duration_hours) || 1.0), 0);
        const totalRevenue = stSessions.reduce((sum, s) => sum + Number(s.session_charge), 0);

        return {
          station_id: st.station_id,
          station_type: st.station_type,
          hourly_rate: st.hourly_rate,
          current_status: st.status,
          sessionCount,
          totalHours: Math.round(totalHours * 10) / 10,
          totalRevenue: Math.round(totalRevenue * 100) / 100
        };
      });

      const grandHours = stationStats.reduce((sum, s) => sum + s.totalHours, 0);
      const grandRevenue = stationStats.reduce((sum, s) => sum + s.totalRevenue, 0);

      setGeneratedReport({
        type: 'USAGE',
        title: 'Station-Usage Report',
        startDate,
        endDate,
        records: stationStats,
        summary: {
          totalSessions: filteredSessions.length,
          grandHours: Math.round(grandHours * 10) / 10,
          grandRevenue: Math.round(grandRevenue * 100) / 100
        }
      });
    } else if (reportType === 'INVENTORY') {
      // Inventory report
      const inventoryReportData = inventory.map(item => {
        const consumedOrders = orders.filter(o => o.item_id === item.item_id);
        const unitsSold = consumedOrders.reduce((sum, o) => sum + o.quantity, 0);
        const stockValue = item.quantity_in_stock * item.unit_price;

        return {
          item_id: item.item_id,
          item_name: item.item_name,
          category: item.category,
          quantity_in_stock: item.quantity_in_stock,
          reorder_level: item.reorder_level,
          unit_price: item.unit_price,
          stockValue: Math.round(stockValue * 100) / 100,
          unitsSold,
          isLow: item.quantity_in_stock <= item.reorder_level
        };
      });

      const totalValuation = inventoryReportData.reduce((sum, i) => sum + i.stockValue, 0);
      const lowCount = inventoryReportData.filter(i => i.isLow).length;

      setGeneratedReport({
        type: 'INVENTORY',
        title: 'Comprehensive Inventory Report',
        startDate,
        endDate,
        records: inventoryReportData,
        summary: {
          totalItems: inventory.length,
          totalValuation: Math.round(totalValuation * 100) / 100,
          lowStockCount: lowCount
        }
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileBarChart size={24} color="var(--accent-cyan)" />
            Management Reports (FR-08)
          </h1>
          <div className="page-subtitle">
            Generate and export official Revenue, Station-Usage, and Inventory reports for selected date ranges
          </div>
        </div>
      </div>

      {/* Report Request Filter Box */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
          Report Parameters & Date Filter
        </h2>
        <form onSubmit={handleGenerate}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Report Type (FR-08)</label>
              <select
                className="form-control"
                value={reportType}
                onChange={e => setReportType(e.target.value)}
              >
                <option value="REVENUE">1. Revenue Report</option>
                <option value="USAGE">2. Station-Usage Report</option>
                <option value="INVENTORY">3. Inventory Report</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-cyan" style={{ width: '100%' }}>
                <FileBarChart size={16} />
                Generate Report
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Generated Report Display */}
      {generatedReport && (
        <div className="card" style={{ padding: '2rem', border: '1px solid var(--border-strong)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: '0.06em' }}>
                GAMEVERSE CAFÉ MANAGEMENT SYSTEM • AUDIT REPORT
              </div>
              <h2 style={{ fontSize: '1.45rem', marginTop: '0.2rem' }}>{generatedReport.title}</h2>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Reporting Window: <strong>{generatedReport.startDate}</strong> to <strong>{generatedReport.endDate}</strong> • Generated on {new Date().toLocaleDateString()}
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
              <Printer size={15} />
              Print / Save PDF
            </button>
          </div>

          {/* Revenue Report Render */}
          {generatedReport.type === 'REVENUE' && (
            <div>
              <div className="grid-cards" style={{ marginBottom: '1.5rem' }}>
                <div className="card" style={{ background: 'var(--bg-surface)' }}>
                  <div className="card-title">Total Revenue</div>
                  <div className="card-value" style={{ color: 'var(--accent-emerald)' }}>
                    ₹{generatedReport.summary.totalRevenue.toFixed(2)}
                  </div>
                  <div className="card-hint">Settled bills in range</div>
                </div>
                <div className="card" style={{ background: 'var(--bg-surface)' }}>
                  <div className="card-title">Gaming Revenue</div>
                  <div className="card-value">
                    ₹{generatedReport.summary.totalGaming.toFixed(2)}
                  </div>
                  <div className="card-hint">Station hourly charges</div>
                </div>
                <div className="card" style={{ background: 'var(--bg-surface)' }}>
                  <div className="card-title">Café Revenue</div>
                  <div className="card-value" style={{ color: 'var(--accent-cyan)' }}>
                    ₹{generatedReport.summary.totalCafe.toFixed(2)}
                  </div>
                  <div className="card-hint">Food & beverages sold</div>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Bill ID</th>
                      <th>Session Ref</th>
                      <th>Customer</th>
                      <th>Station</th>
                      <th>Gaming Charge</th>
                      <th>Café Charge</th>
                      <th>Total Amount</th>
                      <th>Payment Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedReport.records.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                          No bill records match this date range.
                        </td>
                      </tr>
                    ) : (
                      generatedReport.records.map(b => (
                        <tr key={b.bill_id}>
                          <td className="table-code">{b.bill_id}</td>
                          <td>{b.session_id}</td>
                          <td>{b.customer_name}</td>
                          <td>{b.station_id || 'N/A'}</td>
                          <td>₹{Number(b.session_charge).toFixed(2)}</td>
                          <td>₹{Number(b.cafe_charge).toFixed(2)}</td>
                          <td style={{ fontWeight: 700 }}>₹{Number(b.total_amount).toFixed(2)}</td>
                          <td>
                            <span className={`badge badge-${b.payment_status.toLowerCase()}`}>
                              {b.payment_status}
                            </span>
                          </td>
                          <td>{b.payment_date || 'Pending'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Usage Report Render */}
          {generatedReport.type === 'USAGE' && (
            <div>
              <div className="grid-cards" style={{ marginBottom: '1.5rem' }}>
                <div className="card" style={{ background: 'var(--bg-surface)' }}>
                  <div className="card-title">Total Gameplay Hours</div>
                  <div className="card-value" style={{ color: 'var(--accent-cyan)' }}>
                    {generatedReport.summary.grandHours} hrs
                  </div>
                  <div className="card-hint">Across all gaming stations</div>
                </div>
                <div className="card" style={{ background: 'var(--bg-surface)' }}>
                  <div className="card-title">Total Station Revenue</div>
                  <div className="card-value" style={{ color: 'var(--accent-emerald)' }}>
                    ₹{generatedReport.summary.grandRevenue.toFixed(2)}
                  </div>
                  <div className="card-hint">Hardware billing yield</div>
                </div>
                <div className="card" style={{ background: 'var(--bg-surface)' }}>
                  <div className="card-title">Total Completed Sessions</div>
                  <div className="card-value">
                    {generatedReport.summary.totalSessions}
                  </div>
                  <div className="card-hint">Customer sessions logged</div>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Station ID</th>
                      <th>Type</th>
                      <th>Hourly Rate</th>
                      <th>Status</th>
                      <th>Sessions Recorded</th>
                      <th>Total Hours Run</th>
                      <th>Station Revenue Generated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedReport.records.map(st => (
                      <tr key={st.station_id}>
                        <td className="table-code">{st.station_id}</td>
                        <td>{st.station_type}</td>
                        <td>₹{Number(st.hourly_rate).toFixed(2)} / hr</td>
                        <td>
                          <span className={`badge badge-${st.current_status.toLowerCase()}`}>
                            {st.current_status}
                          </span>
                        </td>
                        <td>{st.sessionCount} sessions</td>
                        <td style={{ fontWeight: 600 }}>{st.totalHours} hrs</td>
                        <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                          ₹{st.totalRevenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inventory Report Render */}
          {generatedReport.type === 'INVENTORY' && (
            <div>
              <div className="grid-cards" style={{ marginBottom: '1.5rem' }}>
                <div className="card" style={{ background: 'var(--bg-surface)' }}>
                  <div className="card-title">Catalog Size</div>
                  <div className="card-value">
                    {generatedReport.summary.totalItems} items
                  </div>
                  <div className="card-hint">Café items & accessories</div>
                </div>
                <div className="card" style={{ background: 'var(--bg-surface)' }}>
                  <div className="card-title">Total Stock Valuation</div>
                  <div className="card-value" style={{ color: 'var(--accent-emerald)' }}>
                    ₹{generatedReport.summary.totalValuation.toFixed(2)}
                  </div>
                  <div className="card-hint">Units in stock × Unit price</div>
                </div>
                <div className="card" style={{ background: 'var(--bg-surface)' }}>
                  <div className="card-title">Reorder Alerts</div>
                  <div className="card-value" style={{ color: generatedReport.summary.lowStockCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                    {generatedReport.summary.lowStockCount} items
                  </div>
                  <div className="card-hint">Below required threshold</div>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Item ID</th>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Stock Qty</th>
                      <th>Reorder Level</th>
                      <th>Unit Price</th>
                      <th>Total Stock Value</th>
                      <th>Units Consumed/Sold</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedReport.records.map(item => (
                      <tr key={item.item_id}>
                        <td className="table-code">{item.item_id}</td>
                        <td><strong>{item.item_name}</strong></td>
                        <td>{item.category}</td>
                        <td style={{ fontWeight: 700, color: item.isLow ? 'var(--accent-rose)' : 'var(--text-main)' }}>
                          {item.quantity_in_stock}
                        </td>
                        <td>{item.reorder_level}</td>
                        <td>₹{Number(item.unit_price).toFixed(2)}</td>
                        <td>₹{item.stockValue.toFixed(2)}</td>
                        <td>{item.unitsSold} units</td>
                        <td>
                          {item.isLow ? (
                            <span className="badge badge-lowstock">BELOW REORDER</span>
                          ) : (
                            <span className="badge badge-free">OPTIMAL</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
