import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Gamepad2,
  LayoutDashboard,
  Monitor,
  CalendarCheck,
  PlaySquare,
  Coffee,
  Receipt,
  Users,
  Package,
  FileBarChart,
  Sliders,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function Sidebar({ activeScreen, setActiveScreen }) {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  const role = currentUser.role;

  // Build role-specific menu items strictly according to Section 6 of SRS
  let menuSections = [];

  if (role === 'Customer') {
    menuSections = [
      {
        title: 'Customer Portal',
        items: [
          { id: 'customer_dashboard', label: 'Customer Dashboard', icon: LayoutDashboard },
          { id: 'customer_stations', label: 'Station Availability', icon: Monitor },
          { id: 'customer_reservation', label: 'Station Reservation', icon: CalendarCheck },
          { id: 'customer_sessions', label: 'Booking & Session Info', icon: PlaySquare },
          { id: 'customer_cafe', label: 'Café Order', icon: Coffee },
          { id: 'customer_billing', label: 'Bills & Receipts', icon: Receipt },
        ]
      }
    ];
  } else if (role === 'Staff' || role === 'Receptionist' || role === 'Café Staff') {
    menuSections = [
      {
        title: 'Front Desk & Sessions',
        items: [
          { id: 'staff_console', label: 'Command Center', icon: LayoutDashboard },
          { id: 'receptionist_customers', label: 'Customer Directory', icon: Users },
          { id: 'receptionist_reservations', label: 'Station Reservations', icon: CalendarCheck },
          { id: 'receptionist_sessions', label: 'Active Sessions', icon: PlaySquare },
          { id: 'receptionist_billing', label: 'Billing & Payments', icon: Receipt },
        ]
      },
      {
        title: 'Café Floor & Stock',
        items: [
          { id: 'cafe_orders', label: 'Café Orders', icon: Coffee },
          { id: 'cafe_inventory', label: 'Inventory & Stock', icon: Package },
        ]
      }
    ];
  } else if (role === 'Administrator') {
    menuSections = [
      {
        title: 'Administration',
        items: [
          { id: 'admin_dashboard', label: 'Administrator Dashboard', icon: LayoutDashboard },
          { id: 'admin_users', label: 'User Management', icon: Users },
          { id: 'admin_stations', label: 'Gaming Station Mgmt', icon: Monitor },
          { id: 'admin_inventory', label: 'Inventory Management', icon: Package },
          { id: 'admin_reports', label: 'Reports & Analytics', icon: FileBarChart },
        ]
      }
    ];
  }

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-badge">GV</div>
        <div>
          <div className="brand-text">GAMEVERSE</div>
          <div className="brand-sub">CAFÉ MANAGEMENT</div>
        </div>
      </div>

      {/* Nav Items */}
      <div className="sidebar-nav">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '0.75rem' }}>
            <div className="nav-section-title">{section.title}</div>
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Footer Profile */}
      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="user-avatar">
            {currentUser.name.charAt(0)}
          </div>
          <div className="user-info">
            <div className="user-name">{currentUser.name}</div>
            <span className="user-role-tag">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
