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
    status: 'Free',
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
    status: 'Free',
    hourly_rate: 120.00
  }
];

export const INITIAL_RESERVATIONS = [];

export const INITIAL_SESSIONS = [];

export const INITIAL_ORDERS = [];

export const INITIAL_BILLS = [];

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
