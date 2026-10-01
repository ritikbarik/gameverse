// GameVerse TypeScript Definitions — Domain Models and State Types

export type UserRole = 
  | 'Administrator' 
  | 'Receptionist' 
  | 'Café Staff' 
  | 'Staff' 
  | 'Customer';

export interface User {
  user_id: string;
  name: string;
  role: UserRole | string;
  username: string;
  password?: string;
  phone: string;
  email: string;
}

export type StationType = 'PC' | 'Console';
export type StationStatus = 'Free' | 'Occupied' | 'Maintenance';

export interface Station {
  station_id: string;
  station_type: StationType;
  status: StationStatus;
  hourly_rate: number;
}

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Active' | 'Cancelled' | 'Completed';

export interface Reservation {
  reservation_id: string;
  customer_id: string;
  customer_name?: string;
  station_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: ReservationStatus;
  notes?: string;
}

export interface Session {
  session_id: string;
  reservation_id?: string | null;
  customer_id?: string;
  customer_name?: string;
  station_id: string;
  start_time: string;
  end_time?: string | null;
  duration?: number;
  session_charge?: number;
  status?: 'Active' | 'Completed';
}

export interface CafeOrderItem {
  order_id: string;
  session_id: string;
  item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  amount: number;
  timestamp?: string;
}

export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Online';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Pending';

export interface Bill {
  bill_id: string;
  session_id: string;
  customer_name?: string;
  station_id?: string;
  session_charge: number;
  cafe_charge: number;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_date?: string;
  payment_method?: PaymentMethod;
}

export interface InventoryItem {
  item_id: string;
  item_name: string;
  category: 'Café Items' | 'Gaming Accessories' | string;
  quantity_in_stock: number;
  reorder_level: number;
  unit_price: number;
}

export interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  stations: Station[];
  reservations: Reservation[];
  sessions: Session[];
  orders: CafeOrderItem[];
  bills: Bill[];
  inventory: InventoryItem[];
  notification: string | null;
  showNotification: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  [key: string]: any;
}
