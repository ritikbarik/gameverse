// Initial Seed Data for GameVerse - SRS D1 through D7 Data Stores

export const INITIAL_USERS = [
  {
    user_id: 'USR-001',
    name: 'Admin System',
    role: 'Administrator',
    username: 'admin',
    password: 'admin123',
    phone: '555-0101',
    email: 'admin@gameverse.lan'
  },
  {
    user_id: 'USR-002',
    name: 'Sarah Connor',
    role: 'Staff',
    username: 'staff',
    password: 'staff123',
    phone: '555-0102',
    email: 'sarah.c@gameverse.lan'
  },
  {
    user_id: 'USR-003',
    name: 'Marco Rossi',
    role: 'Staff',
    username: 'cafe',
    password: 'cafe123',
    phone: '555-0103',
    email: 'marco.r@gameverse.lan'
  },
  {
    user_id: 'USR-004',
    name: 'Rohan Sharma',
    role: 'Customer',
    username: 'rohan',
    password: 'cust123',
    phone: '555-0104',
    email: 'rohan.sharma@email.com'
  },
  {
    user_id: 'USR-005',
    name: 'Emily Davis',
    role: 'Customer',
    username: 'emily',
    password: 'cust123',
    phone: '555-0105',
    email: 'emily.d@email.com'
  }
];

export const INITIAL_STATIONS = [
  {
    station_id: 'STN-PC-01',
    station_type: 'PC',
    status: 'Occupied',
    hourly_rate: 80.00
  },
  {
    station_id: 'STN-PC-02',
    station_type: 'PC',
    status: 'Free',
    hourly_rate: 80.00
  },
  {
    station_id: 'STN-PC-03',
    station_type: 'PC',
    status: 'Free',
    hourly_rate: 80.00
  },
  {
    station_id: 'STN-PC-04',
    station_type: 'PC',
    status: 'Maintenance',
    hourly_rate: 80.00
  },
  {
    station_id: 'STN-CON-01',
    station_type: 'Console',
    status: 'Free',
    hourly_rate: 120.00
  },
  {
    station_id: 'STN-CON-02',
    station_type: 'Console',
    status: 'Free',
    hourly_rate: 120.00
  },
  {
    station_id: 'STN-CON-03',
    station_type: 'Console',
    status: 'Occupied',
    hourly_rate: 120.00
  }
];

export const INITIAL_RESERVATIONS = [
  {
    reservation_id: 'RES-101',
    customer_id: 'USR-004',
    customer_name: 'Rohan Sharma',
    station_id: 'STN-PC-01',
    date: '2026-09-30',
    start_time: '18:00',
    end_time: '20:00',
    status: 'Active'
  },
  {
    reservation_id: 'RES-102',
    customer_id: 'USR-005',
    customer_name: 'Emily Davis',
    station_id: 'STN-CON-03',
    date: '2026-09-30',
    start_time: '19:00',
    end_time: '21:00',
    status: 'Active'
  },
  {
    reservation_id: 'RES-103',
    customer_id: 'USR-004',
    customer_name: 'Rohan Sharma',
    station_id: 'STN-PC-02',
    date: '2026-10-01',
    start_time: '14:00',
    end_time: '16:00',
    status: 'Confirmed'
  }
];

export const INITIAL_SESSIONS = [
  {
    session_id: 'SES-501',
    reservation_id: 'RES-101',
    customer_id: 'USR-004',
    customer_name: 'Rohan Sharma',
    station_id: 'STN-PC-01',
    start_time: '2026-09-30T18:00:00',
    end_time: null,
    duration: '2.5 hrs (Active)',
    duration_hours: 2.5,
    session_charge: 200.00,
    status: 'Active'
  },
  {
    session_id: 'SES-502',
    reservation_id: 'RES-102',
    customer_id: 'USR-005',
    customer_name: 'Emily Davis',
    station_id: 'STN-CON-03',
    start_time: '2026-09-30T19:00:00',
    end_time: null,
    duration: '1.5 hrs (Active)',
    duration_hours: 1.5,
    session_charge: 180.00,
    status: 'Active'
  },
  {
    session_id: 'SES-499',
    reservation_id: 'RES-098',
    customer_id: 'USR-005',
    customer_name: 'Emily Davis',
    station_id: 'STN-PC-02',
    start_time: '2026-09-29T15:00:00',
    end_time: '2026-09-29T17:00:00',
    duration: '2.0 hrs',
    duration_hours: 2.0,
    session_charge: 160.00,
    status: 'Completed'
  }
];

export const INITIAL_ORDERS = [
  {
    order_id: 'ORD-301',
    session_id: 'SES-501',
    item_id: 'INV-01',
    item_name: 'Monster Energy Drink 500ml',
    quantity: 2,
    unit_price: 120.00,
    amount: 240.00,
    timestamp: '2026-09-30T18:30:00'
  },
  {
    order_id: 'ORD-302',
    session_id: 'SES-501',
    item_id: 'INV-02',
    item_name: 'Crispy Chicken Burger',
    quantity: 1,
    unit_price: 150.00,
    amount: 150.00,
    timestamp: '2026-09-30T19:00:00'
  },
  {
    order_id: 'ORD-299',
    session_id: 'SES-499',
    item_id: 'INV-03',
    item_name: 'Iced Caramel Macchiato',
    quantity: 1,
    unit_price: 110.00,
    amount: 110.00,
    timestamp: '2026-09-29T15:45:00'
  }
];

export const INITIAL_BILLS = [
  {
    bill_id: 'BIL-701',
    session_id: 'SES-499',
    customer_id: 'USR-005',
    customer_name: 'Emily Davis',
    station_id: 'STN-PC-02',
    session_charge: 160.00,
    cafe_charge: 110.00,
    total_amount: 270.00,
    payment_status: 'Paid',
    payment_date: '2026-09-29'
  }
];

export const INITIAL_INVENTORY = [
  {
    item_id: 'INV-01',
    item_name: 'Monster Energy Drink 500ml',
    category: 'Café Items',
    quantity_in_stock: 18,
    reorder_level: 10,
    unit_price: 120.00
  },
  {
    item_id: 'INV-02',
    item_name: 'Crispy Chicken Burger',
    category: 'Café Items',
    quantity_in_stock: 8,
    reorder_level: 10,
    unit_price: 150.00
  },
  {
    item_id: 'INV-03',
    item_name: 'Iced Caramel Macchiato',
    category: 'Café Items',
    quantity_in_stock: 25,
    reorder_level: 12,
    unit_price: 110.00
  },
  {
    item_id: 'INV-04',
    item_name: 'French Fries (Large)',
    category: 'Café Items',
    quantity_in_stock: 4,
    reorder_level: 8,
    unit_price: 80.00
  },
  {
    item_id: 'INV-05',
    item_name: 'Mineral Water 1L',
    category: 'Café Items',
    quantity_in_stock: 40,
    reorder_level: 15,
    unit_price: 20.00
  },
  {
    item_id: 'INV-06',
    item_name: 'Mechanical Keyboard Switch Set',
    category: 'Gaming Accessories',
    quantity_in_stock: 5,
    reorder_level: 5,
    unit_price: 850.00
  },
  {
    item_id: 'INV-07',
    item_name: 'Pro Gaming Headset Cushion Foam',
    category: 'Gaming Accessories',
    quantity_in_stock: 2,
    reorder_level: 6,
    unit_price: 350.00
  },
  {
    item_id: 'INV-08',
    item_name: 'Speed Edition Mousepad XL',
    category: 'Gaming Accessories',
    quantity_in_stock: 14,
    reorder_level: 5,
    unit_price: 499.00
  }
];
