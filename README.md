# GAMEVERSE — GAMING CAFÉ MANAGEMENT SYSTEM
## SRS-Compliant Functional Prototype

**GAMEVERSE** is a centralized gaming-café management system designed for Windows desktop and local café LAN network environments. It replaces paper/manual café records with a centralized digital system.

---

### 1. Primary Roles & Default Credentials

| Role | Username | Password | Permitted Modules |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Administrator Dashboard, User Management, Gaming Station Mgmt, Inventory Management, Reports & Analytics |
| **Receptionist** | `receptionist` | `rec123` | Receptionist Dashboard, Customer Management, Reservations, Active Sessions, Billing & Payments |
| **Café Staff** | `cafe` | `cafe123` | Café Staff Dashboard, Café Orders, Inventory & Stock |
| **Customer** | `rohan` | `cust123` | Customer Dashboard, Station Availability, Station Reservation, Booking & Session Info, Café Order, Bills & Receipts |

*Note:* A **Demo Workflow Switcher** is also available at the very top of the application to instantly test cross-role operations in real-time.

---

### 2. Functional Requirements Traceability Matrix (FR-01 to FR-08)

| Requirement | Implementation Module | Source File | Description |
| :--- | :--- | :--- | :--- |
| **FR-01: User Management** | Authentication & Role Routing | [`LoginScreen.jsx`](file:///d:/GAMEVERSE/src/screens/LoginScreen.jsx), [`App.jsx`](file:///d:/GAMEVERSE/src/App.jsx) | Authenticates credentials, routes to role dashboards, and enforces strict access barriers (`UnauthorizedScreen.jsx`) against unauthorized modules. |
| **FR-02: Station Management** | Gaming Stations Console | [`StationManagement.jsx`](file:///d:/GAMEVERSE/src/screens/admin/StationManagement.jsx) | Admin adds/modifies gaming stations, configures hardware type (`PC` / `Console`), updates status (`Free`, `Occupied`, `Maintenance`), and sets hourly rates. |
| **FR-03: Reservation** | Station Reservation Desk | [`CustomerReservation.jsx`](file:///d:/GAMEVERSE/src/screens/customer/CustomerReservation.jsx), [`ReceptionistReservations.jsx`](file:///d:/GAMEVERSE/src/screens/receptionist/ReceptionistReservations.jsx) | Checks real-time station availability before creating reservations; disallows reserving occupied/maintenance stations; produces confirmation records. |
| **FR-04: Session Management** | Active Sessions Console | [`ReceptionistSessions.jsx`](file:///d:/GAMEVERSE/src/screens/receptionist/ReceptionistSessions.jsx), [`CustomerSessions.jsx`](file:///d:/GAMEVERSE/src/screens/customer/CustomerSessions.jsx) | Receptionist starts gameplay (station becomes `Occupied`) and ends gameplay (station returns to `Free`, session duration & gaming charges calculated). |
| **FR-05: Café Orders** | Café Order Management | [`CafeOrders.jsx`](file:///d:/GAMEVERSE/src/screens/cafe/CafeOrders.jsx), [`CustomerCafeOrder.jsx`](file:///d:/GAMEVERSE/src/screens/customer/CustomerCafeOrder.jsx) | Records food & beverage orders against active customer sessions; calculates order amounts; instantly deducts stock from inventory. |
| **FR-06: Billing & Payment** | Billing Desk & Receipt Modal | [`ReceptionistBilling.jsx`](file:///d:/GAMEVERSE/src/screens/receptionist/ReceptionistBilling.jsx), [`ReceiptModal.jsx`](file:///d:/GAMEVERSE/src/components/ReceiptModal.jsx) | Combines `Gaming Session Charge + Café Charge = Total Amount`; records counter tender; displays printable itemized receipts. |
| **FR-07: Inventory** | Stock Control & Alerting | [`CafeInventory.jsx`](file:///d:/GAMEVERSE/src/screens/cafe/CafeInventory.jsx), [`AdminInventory.jsx`](file:///d:/GAMEVERSE/src/screens/admin/AdminInventory.jsx) | Monitors stock quantities, supports stock updates, categorizes `Café Items` and `Gaming Accessories`, and highlights low-stock items below reorder thresholds. |
| **FR-08: Reports** | Management Reports Center | [`AdminReports.jsx`](file:///d:/GAMEVERSE/src/screens/admin/AdminReports.jsx) | Generates Revenue Reports, Station-Usage Reports, and Inventory Reports filtered by selected start and end date ranges. |

---

### 3. Database Stores (D1 through D7)

- **D1 — Users**: `user_id`, `name`, `role`, `username`, `password`, `phone`, `email`
- **D2 — Stations**: `station_id`, `station_type` (`PC`, `Console`), `status` (`Free`, `Occupied`, `Maintenance`), `hourly_rate`
- **D3 — Reservations**: `reservation_id`, `customer_id`, `station_id`, `date`, `start_time`, `end_time`, `status`
- **D4 — Sessions**: `session_id`, `reservation_id`, `station_id`, `start_time`, `end_time`, `duration`, `session_charge`
- **D5 — Orders**: `order_id`, `session_id`, `item_id`, `item_name`, `quantity`, `unit_price`, `amount`
- **D6 — Bills**: `bill_id`, `session_id`, `session_charge`, `cafe_charge`, `total_amount`, `payment_status`, `payment_date`
- **D7 — Inventory**: `item_id`, `item_name`, `category`, `quantity_in_stock`, `reorder_level`, `unit_price`

---

### 4. Running the Application Locally

The application runs on Vite with Node.js:

```bash
# In d:\GAMEVERSE:
npm run dev -- --host 127.0.0.1 --port 5173
```

Open your browser at:
`http://127.0.0.1:5173/`

---

### 5. Executing the 23-Step Demonstration Workflow

1. **Login as Customer** (`rohan` / `cust123`).
2. Go to **Station Availability**; view PC and Console stations, statuses, and hourly rates ($10.00/hr, $12.00/hr).
3. Select an available Free station and click **Reserve This Station**.
4. Confirm reservation; see confirmation ID generated and listed in history.
5. **Switch to Receptionist** (`receptionist` / `rec123`) using the top demo bar or login.
6. Open **Reservations**; view the new reservation and click **Start Session**.
7. Station immediately changes to **Occupied**, and the session timer activates.
8. **Switch to Café Staff** (`cafe` / `cafe123`).
9. Go to **Café Orders**; select the active session, pick an item (e.g. *Monster Energy Drink*), set quantity, and click **Record Order**.
10. Navigate to **Inventory & Stock**; verify the item's stock count has decremented.
11. **Switch to Receptionist**; navigate to **Active Sessions**.
12. Click **End Session & Calculate Bill**; enter gameplay duration (e.g. 2.0 hrs) and confirm.
13. Session charge is calculated; station automatically returns to **Free** status; consolidated invoice is generated.
14. Navigate to **Billing & Payments**; notice gaming charge + café charge combined into the total amount.
15. Click **Record Payment**; select Cash or Card tender and mark as Paid.
16. Click **View Receipt**; view and print the itemized receipt.
17. **Switch to Administrator** (`admin` / `admin123`).
18. View real-time station statuses and inventory alerts on **Administrator Dashboard**.
19. Open **Reports & Analytics**; select date range and generate:
    - **Revenue Report**: Itemized breakdown of gaming revenue, café revenue, and grand total.
    - **Station-Usage Report**: Total gameplay hours, session counts, and revenue per station.
    - **Inventory Report**: Stock valuation, units consumed, and reorder warnings.
