import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_STATIONS,
  INITIAL_RESERVATIONS,
  INITIAL_SESSIONS,
  INITIAL_ORDERS,
  INITIAL_BILLS,
  INITIAL_INVENTORY
} from '../data/initialData';
import { syncToFirebase, subscribeToFirebase } from '../services/firebase';

const AppContext = createContext();

const STORAGE_PREFIX = 'gameverse_';

function loadStorage(key, fallback) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e);
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
}

// Real-time synchronization channel for cross-tab / multi-window operations
let syncChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel('gameverse_sync_channel');
  }
} catch (e) {
  console.log('BroadcastChannel not supported in current environment', e);
}

const PRESET_SESSION_IDS = ['SES-501', 'SES-502', 'SES-499'];
const PRESET_ORDER_IDS = ['ORD-301', 'ORD-302', 'ORD-299'];
const PRESET_BILL_IDS = ['BIL-701'];
const PRESET_RESERVATION_IDS = ['RES-101', 'RES-102', 'RES-103'];

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => loadStorage('users', INITIAL_USERS));
  const [sessions, setSessions] = useState(() => {
    const loaded = loadStorage('sessions', INITIAL_SESSIONS);
    return Array.isArray(loaded)
      ? loaded.filter(s => !PRESET_SESSION_IDS.includes(s.session_id))
      : [];
  });
  const [orders, setOrders] = useState(() => {
    const loaded = loadStorage('orders', INITIAL_ORDERS);
    return Array.isArray(loaded)
      ? loaded.filter(o => !PRESET_ORDER_IDS.includes(o.order_id) && !PRESET_SESSION_IDS.includes(o.session_id))
      : [];
  });
  const [bills, setBills] = useState(() => {
    const loaded = loadStorage('bills', INITIAL_BILLS);
    return Array.isArray(loaded)
      ? loaded.filter(b => !PRESET_BILL_IDS.includes(b.bill_id) && !PRESET_SESSION_IDS.includes(b.session_id))
      : [];
  });
  const [stations, setStations] = useState(() => {
    const loaded = loadStorage('stations', INITIAL_STATIONS);
    if (!Array.isArray(loaded)) return INITIAL_STATIONS;
    return loaded.map(st => {
      if ((st.station_id === 'STN-PC-01' || st.station_id === 'STN-CON-03') && st.status === 'Occupied') {
        const rawSessions = loadStorage('sessions', []);
        const hasLiveCustomSession = Array.isArray(rawSessions) && rawSessions.some(
          s => s.station_id === st.station_id && s.status === 'Active' && !PRESET_SESSION_IDS.includes(s.session_id)
        );
        return hasLiveCustomSession ? st : { ...st, status: 'Free' };
      }
      return st;
    });
  });
  const [reservations, setReservations] = useState(() => {
    const loaded = loadStorage('reservations', INITIAL_RESERVATIONS);
    return Array.isArray(loaded)
      ? loaded.filter(r => !PRESET_RESERVATION_IDS.includes(r.reservation_id))
      : [];
  });
  const [inventory, setInventory] = useState(() => loadStorage('inventory', INITIAL_INVENTORY));

  // Current logged in user. Persisted in localStorage so user stays logged in across reload until explicit Sign Out
  const [currentUser, setCurrentUser] = useState(() => loadStorage('currentUser', null));
  const [activeNotification, setActiveNotification] = useState(null);

  // Sync to local storage
  useEffect(() => saveStorage('users', users), [users]);
  useEffect(() => saveStorage('stations', stations), [stations]);
  useEffect(() => saveStorage('reservations', reservations), [reservations]);
  useEffect(() => saveStorage('sessions', sessions), [sessions]);
  useEffect(() => saveStorage('orders', orders), [orders]);
  useEffect(() => saveStorage('bills', bills), [bills]);
  useEffect(() => saveStorage('inventory', inventory), [inventory]);
  useEffect(() => saveStorage('currentUser', currentUser), [currentUser]);

  // Broadcast entity updates to Firebase Cloud + other tabs / windows
  const broadcastSync = (entity, payload) => {
    // 1. Sync to Firebase Cloud
    syncToFirebase(entity, payload);

    // 2. Broadcast across browser tabs/windows
    if (syncChannel) {
      try {
        syncChannel.postMessage({ type: 'GV_SYNC', entity, payload, timestamp: Date.now() });
      } catch (err) {
        console.warn('Broadcast sync failed', err);
      }
    }
  };

  // Real-time listeners: Firebase Cloud + Cross-tab sync
  useEffect(() => {
    // Firebase Cloud Subscriptions
    const unsubRes = subscribeToFirebase('reservations', (data) => {
      if (Array.isArray(data)) setReservations(data);
    });
    const unsubOrd = subscribeToFirebase('orders', (data) => {
      if (Array.isArray(data)) setOrders(data);
    });
    const unsubSes = subscribeToFirebase('sessions', (data) => {
      if (Array.isArray(data)) setSessions(data);
    });
    const unsubStn = subscribeToFirebase('stations', (data) => {
      if (Array.isArray(data)) setStations(data);
    });
    const unsubBll = subscribeToFirebase('bills', (data) => {
      if (Array.isArray(data)) setBills(data);
    });
    const unsubInv = subscribeToFirebase('inventory', (data) => {
      if (Array.isArray(data)) setInventory(data);
    });

    const handleBroadcast = (event) => {
      if (event?.data?.type === 'GV_SYNC') {
        const { entity, payload } = event.data;
        if (entity === 'users') setUsers(payload);
        if (entity === 'stations') setStations(payload);
        if (entity === 'reservations') setReservations(payload);
        if (entity === 'sessions') setSessions(payload);
        if (entity === 'orders') setOrders(payload);
        if (entity === 'bills') setBills(payload);
        if (entity === 'inventory') setInventory(payload);
      }
    };

    const handleStorageEvent = (event) => {
      if (!event.key || !event.key.startsWith(STORAGE_PREFIX)) return;
      const strippedKey = event.key.replace(STORAGE_PREFIX, '');
      try {
        const parsed = JSON.parse(event.newValue);
        if (strippedKey === 'users') setUsers(parsed);
        if (strippedKey === 'stations') setStations(parsed);
        if (strippedKey === 'reservations') setReservations(parsed);
        if (strippedKey === 'sessions') setSessions(parsed);
        if (strippedKey === 'orders') setOrders(parsed);
        if (strippedKey === 'bills') setBills(parsed);
        if (strippedKey === 'inventory') setInventory(parsed);
      } catch (e) {
        // parse error ignored
      }
    };

    if (syncChannel) {
      syncChannel.addEventListener('message', handleBroadcast);
    }
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      unsubRes();
      unsubOrd();
      unsubSes();
      unsubStn();
      unsubBll();
      unsubInv();
      if (syncChannel) syncChannel.removeEventListener('message', handleBroadcast);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const notify = (message, type = 'info') => {
    setActiveNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setActiveNotification(null);
    }, 4000);
  };

  // FR-01: User Management & Authentication
  const login = (username, password) => {
    const found = users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (found) {
      setCurrentUser(found);
      saveStorage('currentUser', found);
      notify(`Welcome back, ${found.name} (${found.role})`, 'success');
      return { success: true, user: found };
    }
    notify('Invalid username or password.', 'error');
    return { success: false, message: 'Invalid username or password.' };
  };

  const loginDirect = (userObject) => {
    if (userObject) {
      setCurrentUser(userObject);
      saveStorage('currentUser', userObject);
      notify(`Authenticated into ${userObject.role === 'Staff' ? 'Staff Operations' : userObject.role} Portal`, 'success');
      return { success: true, user: userObject };
    }
    return { success: false };
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_PREFIX + 'currentUser');
    } catch (e) {}
    notify('Logged out successfully. Please select a portal to sign in.', 'info');
  };

  const addUser = (userData) => {
    const newId = `USR-${String(users.length + 1).padStart(3, '0')}`;
    const newUser = {
      ...userData,
      user_id: newId
    };
    setUsers(prev => [...prev, newUser]);
    notify(`User ${newUser.name} created successfully.`, 'success');
    return newUser;
  };

  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(u => (u.user_id === userId ? { ...u, ...updates } : u)));
    notify('User details updated successfully.', 'success');
  };

  // FR-02: Station Management
  const addStation = (stationData) => {
    if (stations.some(s => s.station_id.toUpperCase() === stationData.station_id.toUpperCase())) {
      notify(`Station ${stationData.station_id} already exists.`, 'error');
      return false;
    }
    const newStation = {
      station_id: stationData.station_id.trim().toUpperCase(),
      station_type: stationData.station_type,
      status: stationData.status || 'Free',
      hourly_rate: Number(stationData.hourly_rate) || 80.00
    };
    setStations(prev => [...prev, newStation]);
    notify(`Station ${newStation.station_id} added successfully.`, 'success');
    return true;
  };

  const updateStation = (stationId, updates) => {
    setStations(prev =>
      prev.map(s => {
        if (s.station_id === stationId) {
          const updated = { ...s, ...updates };
          if (updates.hourly_rate !== undefined) {
            updated.hourly_rate = Number(updates.hourly_rate);
          }
          return updated;
        }
        return s;
      })
    );
    notify(`Station ${stationId} updated successfully.`, 'success');
  };

  // FR-03: Reservation Management
  const createReservation = ({ customer_id, customer_name, station_id, date, start_time, end_time, station_type = 'PC' }) => {
    // Check station availability
    const targetStation = stations.find(s => s.station_id === station_id);
    if (!targetStation) {
      notify('Selected station does not exist.', 'error');
      return { success: false, message: 'Selected station does not exist.' };
    }
    if (targetStation.status === 'Maintenance') {
      notify('This station is currently under maintenance.', 'error');
      return { success: false, message: 'This station is currently under maintenance.' };
    }

    // Check for conflicting reservations on same date & overlapping time
    const hasConflict = reservations.some(
      r => r.station_id === station_id &&
           r.date === date &&
           r.status !== 'Cancelled' &&
           r.status !== 'Completed' &&
           !(end_time <= r.start_time || start_time >= r.end_time)
    );

    if (hasConflict) {
      notify('This station is already reserved for the selected time window.', 'error');
      return { success: false, message: 'This station is already reserved for the selected time window.' };
    }

    const newResId = `RES-${Date.now().toString().slice(-4)}`;
    const newRes = {
      reservation_id: newResId,
      customer_id: customer_id || 'USR-WALK',
      customer_name: customer_name || 'Customer',
      station_id: station_id,
      station_type: station_type,
      date: date,
      start_time: start_time,
      end_time: end_time,
      status: 'Confirmed',
      created_at: new Date().toISOString()
    };

    setReservations(prev => {
      const updated = [newRes, ...prev];
      broadcastSync('reservations', updated);
      return updated;
    });
    notify(`Reservation ${newResId} confirmed for Station ${station_id}. Real-time synced to Admin.`, 'success');
    return { success: true, reservation: newRes };
  };

  const updateReservationStatus = (reservationId, status) => {
    setReservations(prev => {
      const updated = prev.map(r => (r.reservation_id === reservationId ? { ...r, status } : r));
      broadcastSync('reservations', updated);
      return updated;
    });
    notify(`Reservation ${reservationId} status updated to ${status}.`, 'info');
  };

  // FR-04: Session Management
  const startSession = ({ reservation_id, customer_id, customer_name, station_id }) => {
    const station = stations.find(s => s.station_id === station_id);
    if (!station) {
      notify('Station not found.', 'error');
      return null;
    }
    if (station.status === 'Occupied') {
      notify('This station is currently unavailable / already occupied.', 'error');
      return null;
    }
    if (station.status === 'Maintenance') {
      notify('Station is under maintenance.', 'error');
      return null;
    }

    const newSessionId = `SES-${Date.now().toString().slice(-4)}`;
    const nowIso = new Date().toISOString();

    const newSession = {
      session_id: newSessionId,
      reservation_id: reservation_id || null,
      customer_id: customer_id || 'USR-WALK',
      customer_name: customer_name || 'Customer',
      station_id: station_id,
      start_time: nowIso,
      end_time: null,
      duration: 'Active (Ongoing)',
      duration_hours: 1.0,
      session_charge: station.hourly_rate,
      status: 'Active'
    };

    // Update station to Occupied
    setStations(prev => {
      const updated = prev.map(s => (s.station_id === station_id ? { ...s, status: 'Occupied' } : s));
      broadcastSync('stations', updated);
      return updated;
    });

    // Update reservation status to Active if attached
    if (reservation_id) {
      setReservations(prev => {
        const updated = prev.map(r => (r.reservation_id === reservation_id ? { ...r, status: 'Active' } : r));
        broadcastSync('reservations', updated);
        return updated;
      });
    }

    setSessions(prev => {
      const updated = [newSession, ...prev];
      broadcastSync('sessions', updated);
      return updated;
    });
    notify(`Session ${newSessionId} started on Station ${station_id}. Real-time synced.`, 'success');
    return newSession;
  };

  const endSession = (sessionId, manualHours = null) => {
    const session = sessions.find(s => s.session_id === sessionId);
    if (!session) {
      notify('Session not found.', 'error');
      return null;
    }
    if (session.status === 'Completed') {
      notify('Session has already ended.', 'error');
      return null;
    }

    const station = stations.find(s => s.station_id === session.station_id);
    const hourlyRate = station ? station.hourly_rate : 10.00;

    // Calculate duration in hours
    const startTime = new Date(session.start_time).getTime();
    const endTime = Date.now();
    let hours = (endTime - startTime) / (1000 * 60 * 60);

    if (manualHours !== null && manualHours > 0) {
      hours = Number(manualHours);
    } else if (hours < 0.25) {
      hours = 1.5;
    }
    hours = Math.round(hours * 10) / 10;

    const sessionCharge = Math.round(hours * hourlyRate * 100) / 100;
    const durationStr = `${hours} hrs`;
    const endIso = new Date().toISOString();

    // Calculate ONLY confirmed delivered café orders for this session (FR-05 / FR-06)
    const deliveredOrders = orders.filter(
      o => o.session_id === sessionId && (o.order_status === 'Delivered' || o.order_status === 'Delivered to Station' || o.delivered === true)
    );
    const cafeCharge = deliveredOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    const totalAmount = Math.round((sessionCharge + cafeCharge) * 100) / 100;

    // Check for any unconfirmed pending café orders
    const pendingOrders = orders.filter(
      o => o.session_id === sessionId && !o.delivered && o.order_status !== 'Delivered' && o.order_status !== 'Delivered to Station'
    );

    // Update Session
    setSessions(prev => {
      const updated = prev.map(s =>
        s.session_id === sessionId
          ? {
              ...s,
              end_time: endIso,
              duration: durationStr,
              duration_hours: hours,
              session_charge: sessionCharge,
              status: 'Completed'
            }
          : s
      );
      broadcastSync('sessions', updated);
      return updated;
    });

    // Free the station
    setStations(prev => {
      const updated = prev.map(s => (s.station_id === session.station_id ? { ...s, status: 'Free' } : s));
      broadcastSync('stations', updated);
      return updated;
    });

    // Mark associated reservation as Completed
    if (session.reservation_id) {
      setReservations(prev => {
        const updated = prev.map(r => (r.reservation_id === session.reservation_id ? { ...r, status: 'Completed' } : r));
        broadcastSync('reservations', updated);
        return updated;
      });
    }

    // FR-06: Automatically Generate Bill with Gaming Charges + Delivered Café Charges
    const newBillId = `BIL-${Date.now().toString().slice(-4)}`;
    const newBill = {
      bill_id: newBillId,
      session_id: sessionId,
      customer_id: session.customer_id,
      customer_name: session.customer_name,
      station_id: session.station_id,
      session_charge: sessionCharge,
      cafe_charge: cafeCharge,
      total_amount: totalAmount,
      payment_status: 'Unpaid',
      payment_date: null
    };

    setBills(prev => {
      const updated = [newBill, ...prev];
      broadcastSync('bills', updated);
      return updated;
    });

    if (pendingOrders.length > 0) {
      notify(`Session ended. Bill ${newBillId} generated (Total: ₹${totalAmount.toFixed(2)}). Note: ${pendingOrders.length} undelivered café item(s) were excluded from billing.`, 'info');
    } else {
      notify(`Session ended. Bill ${newBillId} generated at Reception (Total: ₹${totalAmount.toFixed(2)}).`, 'success');
    }
    return newBill;
  };

  // FR-05: Café Orders & Real-time Customer Food Demands
  const addCafeOrder = ({ session_id, item_id, quantity, delivered = false }) => {
    const qty = parseInt(quantity, 10);
    if (!session_id) {
      notify('Please select an active session.', 'error');
      return { success: false, message: 'Please select an active session.' };
    }
    if (!qty || qty <= 0) {
      notify('Quantity must be greater than zero.', 'error');
      return { success: false, message: 'Quantity must be greater than zero.' };
    }

    const session = sessions.find(s => s.session_id === session_id);
    if (!session || session.status !== 'Active') {
      notify('Cannot add order. Please select an active session.', 'error');
      return { success: false, message: 'Selected session is not active.' };
    }

    const invItem = inventory.find(i => i.item_id === item_id);
    if (!invItem) {
      notify('Selected item does not exist.', 'error');
      return { success: false, message: 'Item not found.' };
    }

    if (invItem.quantity_in_stock < qty) {
      notify(`Insufficient stock. Only ${invItem.quantity_in_stock} available.`, 'error');
      return { success: false, message: 'Insufficient stock.' };
    }

    // Deduct stock in FR-07 Inventory
    setInventory(prev => {
      const updated = prev.map(item =>
        item.item_id === item_id
          ? { ...item, quantity_in_stock: item.quantity_in_stock - qty }
          : item
      );
      broadcastSync('inventory', updated);
      return updated;
    });

    const orderAmount = Math.round(qty * invItem.unit_price * 100) / 100;
    const newOrderId = `ORD-${Date.now().toString().slice(-4)}`;
    const nowIso = new Date().toISOString();

    const newOrder = {
      order_id: newOrderId,
      session_id: session_id,
      customer_id: session.customer_id,
      customer_name: session.customer_name,
      station_id: session.station_id,
      item_id: item_id,
      item_name: invItem.item_name,
      quantity: qty,
      unit_price: invItem.unit_price,
      amount: orderAmount,
      order_status: delivered ? 'Delivered' : 'Pending Delivery',
      delivered: Boolean(delivered),
      delivered_at: delivered ? nowIso : null,
      timestamp: nowIso
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      broadcastSync('orders', updated);
      return updated;
    });

    // If delivered immediately, update bill if one exists
    if (delivered) {
      setBills(prevBills => {
        const billIndex = prevBills.findIndex(b => b.session_id === session_id);
        if (billIndex >= 0) {
          const bill = prevBills[billIndex];
          const newCafeCharge = Math.round((Number(bill.cafe_charge || 0) + orderAmount) * 100) / 100;
          const newTotal = Math.round((Number(bill.session_charge || 0) + newCafeCharge) * 100) / 100;
          const updated = [...prevBills];
          updated[billIndex] = { ...bill, cafe_charge: newCafeCharge, total_amount: newTotal };
          broadcastSync('bills', updated);
          return updated;
        }
        return prevBills;
      });
    }

    notify(
      delivered
        ? `Order placed & delivered: ${qty}x ${invItem.item_name} (₹${orderAmount.toFixed(2)}) for Station ${session.station_id}. Added to bill!`
        : `Food demand placed: ${qty}x ${invItem.item_name} for Station ${session.station_id}. Reflected in Café Portal!`,
      'success'
    );
    return { success: true, order: newOrder };
  };

  // Confirm order delivery from Café to Customer Station, and add cost to session bill
  const confirmOrderDelivery = (orderId) => {
    let deliveredOrder = null;
    const nowIso = new Date().toISOString();

    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.order_id === orderId) {
          deliveredOrder = {
            ...o,
            order_status: 'Delivered',
            delivered: true,
            delivered_at: nowIso
          };
          return deliveredOrder;
        }
        return o;
      });
      broadcastSync('orders', updated);

      // If a bill already exists for this session, add the confirmed cost to the bill
      if (deliveredOrder) {
        setBills(prevBills => {
          const billIndex = prevBills.findIndex(b => b.session_id === deliveredOrder.session_id);
          if (billIndex >= 0) {
            const bill = prevBills[billIndex];
            const sessionDeliveredOrders = updated.filter(
              o => o.session_id === deliveredOrder.session_id && (o.order_status === 'Delivered' || o.delivered === true)
            );
            const newCafeCharge = sessionDeliveredOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
            const newTotal = Math.round((Number(bill.session_charge || 0) + newCafeCharge) * 100) / 100;
            const updatedBills = [...prevBills];
            updatedBills[billIndex] = {
              ...bill,
              cafe_charge: newCafeCharge,
              total_amount: newTotal
            };
            broadcastSync('bills', updatedBills);
            return updatedBills;
          }
          return prevBills;
        });
      }

      return updated;
    });

    if (deliveredOrder) {
      notify(`Order ${orderId} delivered to Station ${deliveredOrder.station_id}! Cost of ₹${deliveredOrder.amount.toFixed(2)} confirmed and added to billing.`, 'success');
    }
    return deliveredOrder;
  };

  // General Update Food Order Status
  const updateOrderStatus = (orderId, newStatus) => {
    if (newStatus === 'Delivered' || newStatus === 'Delivered to Station') {
      return confirmOrderDelivery(orderId);
    }
    setOrders(prev => {
      const updated = prev.map(o => (o.order_id === orderId ? { ...o, order_status: newStatus } : o));
      broadcastSync('orders', updated);
      return updated;
    });
    notify(`Order ${orderId} status changed to ${newStatus}.`, 'info');
  };

  // FR-06: Billing & Payment
  const recordPayment = (billId, paymentMethod = 'Cash') => {
    const today = new Date().toISOString().split('T')[0];
    let updatedBill = null;

    setBills(prev => {
      const updated = prev.map(b => {
        if (b.bill_id === billId) {
          updatedBill = {
            ...b,
            payment_status: 'Paid',
            payment_date: today,
            payment_method: paymentMethod
          };
          return updatedBill;
        }
        return b;
      });
      broadcastSync('bills', updated);
      return updated;
    });

    notify(`Payment recorded successfully for Bill ${billId}.`, 'success');
    return updatedBill;
  };

  // FR-07: Inventory Management
  const updateStock = (itemId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty < 0) {
      notify('Quantity must be zero or a positive number.', 'error');
      return false;
    }
    setInventory(prev =>
      prev.map(item =>
        item.item_id === itemId
          ? { ...item, quantity_in_stock: qty }
          : item
      )
    );
    notify(`Stock updated for ${itemId}.`, 'success');
    return true;
  };

  const addInventoryItem = (itemData) => {
    if (inventory.some(i => i.item_id.toUpperCase() === itemData.item_id.toUpperCase())) {
      notify(`Item ID ${itemData.item_id} already exists.`, 'error');
      return false;
    }
    const newItem = {
      item_id: itemData.item_id.trim().toUpperCase(),
      item_name: itemData.item_name.trim(),
      category: itemData.category || 'Café Items',
      quantity_in_stock: parseInt(itemData.quantity_in_stock, 10) || 0,
      reorder_level: parseInt(itemData.reorder_level, 10) || 5,
      unit_price: Number(itemData.unit_price) || 1.00
    };
    setInventory(prev => [...prev, newItem]);
    notify(`Item ${newItem.item_name} added to inventory.`, 'success');
    return true;
  };

  const updateInventoryItem = (itemId, updates) => {
    setInventory(prev =>
      prev.map(item => (item.item_id === itemId ? { ...item, ...updates } : item))
    );
    notify('Inventory item updated.', 'success');
  };

  const deleteInventoryItem = (itemId) => {
    setInventory(prev => prev.filter(item => item.item_id !== itemId));
    notify(`Inventory item ${itemId} removed.`, 'info');
    return true;
  };

  // Reset to default demo data
  const resetToDemo = () => {
    setUsers(INITIAL_USERS);
    setStations(INITIAL_STATIONS);
    setReservations(INITIAL_RESERVATIONS);
    setSessions(INITIAL_SESSIONS);
    setOrders(INITIAL_ORDERS);
    setBills(INITIAL_BILLS);
    setInventory(INITIAL_INVENTORY);
    setCurrentUser(INITIAL_USERS[1]); // Receptionist
    notify('System reset to initial sample demo data.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        users,
        stations,
        reservations,
        sessions,
        orders,
        bills,
        inventory,
        currentUser,
        activeNotification,
        notify,
        login,
        loginDirect,
        logout,
        addUser,
        updateUser,
        addStation,
        updateStation,
        createReservation,
        updateReservationStatus,
        startSession,
        endSession,
        addCafeOrder,
        confirmOrderDelivery,
        updateOrderStatus,
        recordPayment,
        updateStock,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        resetToDemo
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
