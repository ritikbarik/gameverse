import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ReceiptModal from './components/ReceiptModal';
import UnauthorizedScreen from './components/UnauthorizedScreen';
import SplashLoader from './components/SplashLoader';
import LandingPage from './components/LandingPage';

// Auth Screen with 3 distinct portals
import LoginScreen from './screens/LoginScreen';

// Customer screens
import CustomerDashboard from './screens/customer/CustomerDashboard';
import StationAvailability from './screens/customer/StationAvailability';
import CustomerReservation from './screens/customer/CustomerReservation';
import CustomerSessions from './screens/customer/CustomerSessions';
import CustomerCafeOrder from './screens/customer/CustomerCafeOrder';
import CustomerBilling from './screens/customer/CustomerBilling';

// Consolidated Staff Operations screens (combining Receptionist + Café Staff)
import StaffConsole from './screens/staff/StaffConsole';
import CustomerManagement from './screens/receptionist/CustomerManagement';
import ReceptionistReservations from './screens/receptionist/ReceptionistReservations';
import ReceptionistSessions from './screens/receptionist/ReceptionistSessions';
import ReceptionistBilling from './screens/receptionist/ReceptionistBilling';
import CafeOrders from './screens/cafe/CafeOrders';
import CafeInventory from './screens/cafe/CafeInventory';

// Administrator screens
import AdminDashboard from './screens/admin/AdminDashboard';
import UserManagement from './screens/admin/UserManagement';
import StationManagement from './screens/admin/StationManagement';
import AdminInventory from './screens/admin/AdminInventory';
import AdminReports from './screens/admin/AdminReports';

import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ROLE_PERMITTED_SCREENS = {
  Customer: [
    'customer_dashboard',
    'customer_stations',
    'customer_reservation',
    'customer_sessions',
    'customer_cafe',
    'customer_billing'
  ],
  Staff: [
    'staff_console',
    'receptionist_customers',
    'receptionist_reservations',
    'receptionist_sessions',
    'receptionist_billing',
    'cafe_orders',
    'cafe_inventory'
  ],
  Receptionist: [
    'staff_console',
    'receptionist_customers',
    'receptionist_reservations',
    'receptionist_sessions',
    'receptionist_billing',
    'cafe_orders',
    'cafe_inventory'
  ],
  'Café Staff': [
    'staff_console',
    'receptionist_customers',
    'receptionist_reservations',
    'receptionist_sessions',
    'receptionist_billing',
    'cafe_orders',
    'cafe_inventory'
  ],
  Administrator: [
    'admin_dashboard',
    'admin_users',
    'admin_stations',
    'admin_inventory',
    'admin_reports'
  ]
};

const DEFAULT_SCREEN_FOR_ROLE = {
  Customer: 'customer_dashboard',
  Staff: 'staff_console',
  Receptionist: 'staff_console',
  'Café Staff': 'staff_console',
  Administrator: 'admin_dashboard'
};

export default function App() {
  const { currentUser, logout, activeNotification, startSession } = useApp();

  // Page reload animation
  const [showSplash, setShowSplash] = useState(true);

  // If user already authenticated in localStorage, take them directly to their portal; otherwise show landing
  const [showLanding, setShowLanding] = useState(!currentUser);
  const [activeScreen, setActiveScreen] = useState('staff_console');
  const [selectedReceiptBill, setSelectedReceiptBill] = useState(null);

  // Pre-selection states for customer booking from availability screen
  const [preselectedStation, setPreselectedStation] = useState({ id: '', type: 'ALL' });

  // Update active screen whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      const permitted = ROLE_PERMITTED_SCREENS[currentUser.role] || [];
      if (!permitted.includes(activeScreen)) {
        setActiveScreen(DEFAULT_SCREEN_FOR_ROLE[currentUser.role] || permitted[0] || 'staff_console');
      }
    }
  }, [currentUser, activeScreen]);

  // Handle direct reservation from StationAvailability
  const handleSelectForReservation = (stId, stType) => {
    setPreselectedStation({ id: stId, type: stType });
    setActiveScreen('customer_reservation');
  };

  // Handle direct session start from ReceptionistReservations
  const handleStartSessionDirect = (reservation) => {
    startSession({
      reservation_id: reservation.reservation_id,
      customer_id: reservation.customer_id,
      customer_name: reservation.customer_name,
      station_id: reservation.station_id
    });
    setActiveScreen('receptionist_sessions');
  };

  const renderContent = () => {
    if (showLanding) {
      return (
        <LandingPage
          onGetStarted={() => setShowLanding(false)}
          onLogin={() => setShowLanding(false)}
        />
      );
    }

    if (!currentUser) {
      return (
        <LoginScreen
          onLoginSuccess={(user) => {
            setActiveScreen(DEFAULT_SCREEN_FOR_ROLE[user.role] || 'customer_dashboard');
          }}
          onBackToLanding={() => setShowLanding(true)}
        />
      );
    }

    const role = currentUser.role;
    const permittedScreens = ROLE_PERMITTED_SCREENS[role] || [];
    const isPermitted = permittedScreens.includes(activeScreen);

    const renderScreen = () => {
      if (!isPermitted) {
        return (
          <UnauthorizedScreen
            onReturnToDashboard={() => setActiveScreen(DEFAULT_SCREEN_FOR_ROLE[role])}
          />
        );
      }

      // Customer screens
      if (activeScreen === 'customer_dashboard') {
        return (
          <CustomerDashboard
            onNavigate={setActiveScreen}
            onOpenReceipt={setSelectedReceiptBill}
          />
        );
      }
      if (activeScreen === 'customer_stations') {
        return <StationAvailability onSelectForReservation={handleSelectForReservation} />;
      }
      if (activeScreen === 'customer_reservation') {
        return (
          <CustomerReservation
            preselectedStationId={preselectedStation.id}
            preselectedType={preselectedStation.type}
          />
        );
      }
      if (activeScreen === 'customer_sessions') {
        return <CustomerSessions />;
      }
      if (activeScreen === 'customer_cafe') {
        return <CustomerCafeOrder />;
      }
      if (activeScreen === 'customer_billing') {
        return <CustomerBilling onOpenReceipt={setSelectedReceiptBill} />;
      }

      // Staff Operations Portal screens (Combined Receptionist + Café Staff)
      if (activeScreen === 'staff_console') {
        return (
          <StaffConsole
            onOpenReceipt={setSelectedReceiptBill}
            onNavigate={setActiveScreen}
          />
        );
      }
      if (activeScreen === 'receptionist_customers') {
        return <CustomerManagement />;
      }
      if (activeScreen === 'receptionist_reservations') {
        return (
          <ReceptionistReservations
            onStartSessionDirect={handleStartSessionDirect}
          />
        );
      }
      if (activeScreen === 'receptionist_sessions') {
        return (
          <ReceptionistSessions
            onOpenReceipt={setSelectedReceiptBill}
            onNavigate={setActiveScreen}
          />
        );
      }
      if (activeScreen === 'receptionist_billing') {
        return <ReceptionistBilling onOpenReceipt={setSelectedReceiptBill} />;
      }
      if (activeScreen === 'cafe_orders') {
        return <CafeOrders />;
      }
      if (activeScreen === 'cafe_inventory') {
        return <CafeInventory />;
      }

      // Administrator screens
      if (activeScreen === 'admin_dashboard') {
        return <AdminDashboard onNavigate={setActiveScreen} />;
      }
      if (activeScreen === 'admin_users') {
        return <UserManagement />;
      }
      if (activeScreen === 'admin_stations') {
        return <StationManagement />;
      }
      if (activeScreen === 'admin_inventory') {
        return <AdminInventory />;
      }
      if (activeScreen === 'admin_reports') {
        return <AdminReports />;
      }

      return <div>Select a valid module from the navigation sidebar.</div>;
    };

    return (
      <div className="app-container">
        {/* Role Navigation Sidebar */}
        <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

        {/* Main Layout Area */}
        <div className="main-layout">
          <Navbar
            onLogout={() => {
              logout();
              setShowLanding(true);
            }}
          />

          <main className="main-content">
            {renderScreen()}
          </main>
        </div>

        {/* Itemized Bill / Receipt Modal */}
        {selectedReceiptBill && (
          <ReceiptModal
            bill={selectedReceiptBill}
            onClose={() => setSelectedReceiptBill(null)}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {/* Page Reload & Launch Animation */}
      {showSplash && (
        <SplashLoader onComplete={() => setShowSplash(false)} />
      )}

      {renderContent()}

      {/* Real-time Notification Toast */}
      {activeNotification && (
        <div className="toast-container">
          <div className={`toast toast-${activeNotification.type}`}>
            {activeNotification.type === 'success' && <CheckCircle2 size={18} color="#10b981" />}
            {activeNotification.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
            {activeNotification.type === 'info' && <Info size={18} color="#06b6d4" />}
            <span>{activeNotification.message}</span>
          </div>
        </div>
      )}
    </>
  );
}
